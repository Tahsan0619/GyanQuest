using System;
using System.Diagnostics;
using System.IO;

internal static class Program
{
    static int Main()
    {
        try
        {
            string src = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');
            string dest = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Programs", "GyanQuest");
            Console.WriteLine("Installing GyanQuest to:");
            Console.WriteLine("  " + dest);
            Directory.CreateDirectory(dest);
            foreach (string dir in Directory.GetDirectories(src, "*", SearchOption.AllDirectories))
            {
                string rel = dir.Substring(src.Length).TrimStart('\\');
                Directory.CreateDirectory(Path.Combine(dest, rel));
            }
            foreach (string file in Directory.GetFiles(src, "*", SearchOption.AllDirectories))
            {
                string name = Path.GetFileName(file);
                if (name.Equals("payload.zip", StringComparison.OrdinalIgnoreCase))
                    continue;
                string rel = file.Substring(src.Length).TrimStart('\\');
                string target = Path.Combine(dest, rel);
                Directory.CreateDirectory(Path.GetDirectoryName(target));
                File.Copy(file, target, true);
            }
            string exe = Path.Combine(dest, "GyanQuest.exe");
            if (!File.Exists(exe))
            {
                Console.WriteLine("ERROR: GyanQuest.exe not found. Keep Install.exe next to GyanQuest.exe.");
                return 1;
            }
            string desktop = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory),
                "GyanQuest.lnk");
            string startDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs");
            Directory.CreateDirectory(startDir);
            string start = Path.Combine(startDir, "GyanQuest.lnk");
            Shortcut(exe, dest, desktop);
            Shortcut(exe, dest, start);
            string wv = Path.Combine(dest, "MicrosoftEdgeWebview2Setup.exe");
            if (File.Exists(wv))
            {
                Console.WriteLine("Checking WebView2...");
                try
                {
                    var p = Process.Start(new ProcessStartInfo(wv, "/silent /install") { UseShellExecute = false });
                    if (p != null) p.WaitForExit(120000);
                }
                catch { }
            }
            Console.WriteLine("Done. Launching GyanQuest...");
            Process.Start(new ProcessStartInfo(exe) { WorkingDirectory = dest, UseShellExecute = true });
            return 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return 1;
        }
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
}
