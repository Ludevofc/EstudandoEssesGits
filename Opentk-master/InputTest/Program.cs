using System;
using System.Threading;
using OpenTK;
using OpenTK.Input;
using OpenTK.Platform;


namespace InputTest
{
    class Program
    {
        static void Main(string[] args)
        {
            Toolkit.Init(new ToolkitOptions()
            {
                Backend = PlatformBackend.PreferNative,
                EnableHighResolution = true
            });
            Console.WriteLine("Testing Keyboard");

            while (true)
            {
                var mouseCurs = Mouse.GetCursorState();
                var mouse = Mouse.GetState();
                if (mouseCurs.IsAnyButtonDown || mouse.IsAnyButtonDown)
                {
                    Console.WriteLine(mouseCurs.X + " " + mouseCurs.Y + " - " + mouse.X + " " + mouse.Y);
                }

                Thread.Sleep(500);
            }
        }
    }
}
