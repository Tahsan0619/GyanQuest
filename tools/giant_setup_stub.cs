using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Text;
using System.Windows.Forms;

internal static class Program
{
    static readonly byte[] Magic = Encoding.ASCII.GetBytes("GQINST1\n");

    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        try
        {
            Run();
        }
        catch (Exception ex)
        {
            MessageBox.Show(ex.Message, "GyanQuest Setup", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    static void Run()
    {
        string dest = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "Programs", "GyanQuest");
        var form = new Form
        {
            Text = "GyanQuest Setup",
            ClientSize = new Size(460, 130),
            FormBorderStyle = FormBorderStyle.FixedDialog,
            MaximizeBox = false,
            MinimizeBox = false,
            StartPosition = FormStartPosition.CenterScreen
        };
        var label = new Label
        {
            AutoSize = false,
            Size = new Size(420, 40),
            Location = new Point(20, 18),
            Text = "Installing GyanQuest…"
        };
        var bar = new ProgressBar
        {
            Location = new Point(20, 70),
            Size = new Size(420, 22),
            Minimum = 0,
            Maximum = 100
        };
        form.Controls.Add(label);
        form.Controls.Add(bar);
        form.Show();
        Application.DoEvents();

        string self = Application.ExecutablePath;
        using (var fs = File.OpenRead(self))
        {
            int start = FindMagic(fs);
            if (start < 0)
                throw new Exception("This installer is damaged (payload marker missing).");
            fs.Position = start + Magic.Length;
            uint count = ReadU32(fs);
            if (count == 0 || count > 200000)
                throw new Exception("This installer is damaged (file count).");
            bar.Maximum = (int)count;
            Directory.CreateDirectory(dest);
            for (uint i = 0; i < count; i++)
            {
                ushort pathLen = ReadU16(fs);
                byte[] pathBytes = new byte[pathLen];
                ReadExact(fs, pathBytes, pathLen);
                string rel = Encoding.UTF8.GetString(pathBytes).Replace('/', '\\');
                ulong size = ReadU64(fs);
                if (rel.IndexOf("..", StringComparison.Ordinal) >= 0)
                    throw new Exception("Invalid path in installer.");
                string outPath = Path.Combine(dest, rel);
                string dir = Path.GetDirectoryName(outPath);
                if (!string.IsNullOrEmpty(dir))
                    Directory.CreateDirectory(dir);
                label.Text = "Installing " + rel;
                bar.Value = (int)i;
                Application.DoEvents();
                using (var outFile = File.Create(outPath))
                {
                    ulong left = size;
                    byte[] buf = new byte[1024 * 1024];
                    while (left > 0)
                    {
                        int n = (int)Math.Min((ulong)buf.Length, left);
                        ReadExact(fs, buf, n);
                        outFile.Write(buf, 0, n);
                        left -= (ulong)n;
                    }
                }
            }
            bar.Value = bar.Maximum;
        }

        string exe = Path.Combine(dest, "GyanQuest.exe");
        if (!File.Exists(exe))
            throw new Exception("Install finished but GyanQuest.exe is missing.");

        string desktop = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory),
            "GyanQuest.lnk");
        string startDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs");
        Directory.CreateDirectory(startDir);
        Shortcut(exe, dest, desktop);
        Shortcut(exe, dest, Path.Combine(startDir, "GyanQuest.lnk"));

        string wv = Path.Combine(dest, "MicrosoftEdgeWebview2Setup.exe");
        if (File.Exists(wv))
        {
            label.Text = "Installing WebView2 if needed…";
            Application.DoEvents();
            try
            {
                var p = Process.Start(new ProcessStartInfo(wv, "/silent /install") { UseShellExecute = false });
                if (p != null) p.WaitForExit(180000);
            }
            catch { }
        }

        label.Text = "Starting GyanQuest…";
        Application.DoEvents();
        Process.Start(new ProcessStartInfo(exe) { WorkingDirectory = dest, UseShellExecute = true });
        form.Close();
    }

    static int FindMagic(FileStream fs)
    {
        long keep = Math.Min(fs.Length, 2 * 1024 * 1024);
        byte[] head = new byte[keep];
        fs.Position = 0;
        int n = fs.Read(head, 0, head.Length);
        for (int i = 0; i + Magic.Length <= n; i++)
        {
            bool ok = true;
            for (int j = 0; j < Magic.Length; j++)
            {
                if (head[i + j] != Magic[j]) { ok = false; break; }
            }
            if (ok) return i;
        }
        return -1;
    }

    static void Shortcut(string target, string workDir, string lnk)
    {
        Type t = Type.GetTypeFromProgID("WScript.Shell");
        dynamic shell = Activator.CreateInstance(t);
        dynamic s = shell.CreateShortcut(lnk);
        s.TargetPath = target;
        s.WorkingDirectory = workDir;
        s.Save();
    }

    static ushort ReadU16(Stream s)
    {
        byte[] b = new byte[2];
        ReadExact(s, b, 2);
        return (ushort)(b[0] | (b[1] << 8));
    }

    static uint ReadU32(Stream s)
    {
        byte[] b = new byte[4];
        ReadExact(s, b, 4);
        return (uint)(b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24));
    }

    static ulong ReadU64(Stream s)
    {
        uint lo = ReadU32(s);
        uint hi = ReadU32(s);
        return ((ulong)hi << 32) | lo;
    }

    static void ReadExact(Stream s, byte[] buf, int n)
    {
        int off = 0;
        while (off < n)
        {
            int r = s.Read(buf, off, n - off);
            if (r <= 0) throw new EndOfStreamException("Installer ended early.");
            off += r;
        }
    }
}
