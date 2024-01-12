//
// The Open Toolkit Library License
//
// Copyright (c) 2006 - 2013 Stefanos Apostolopoulos for the Open Toolkit library.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//

using System;
using System.Diagnostics;
using System.Security;
using System.Runtime.InteropServices;
using System.Text;

#pragma warning disable 0169

namespace OpenTK.Platform.SDL2
{
    using Surface = IntPtr;
    using Cursor = IntPtr;

    internal partial class SDL
    {
        private static NativeLibrary NativeLib = NativeLibrary.Load(GetLibraryName());

        private static string GetLibraryName()
        {
#if NETSTANDARD
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                return "SDL2.dll";
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                return "libSDL2-2.0.so.0";
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                return "libsdl2.dylib";
            }
            else
            {
                return "SDL2.dll";
            }
#else
            return "SDL2.dll";
#endif
        }

        public readonly static object Sync = new object();
        private static Nullable<Version> version;
        public static Version Version
        {
            get
            {
                try
                {
                    if (!version.HasValue)
                    {
                        version = GetVersion();
                    }
                    return version.Value;
                }
                catch
                {
                    // nom nom
                    Debug.Print("[SDL2] Failed to retrieve version");
                    return new Version();
                }
            }
        }

        private static string IntPtrToString(IntPtr ptr)
        {
            return Marshal.PtrToStringAnsi(ptr);
            //int strlen = 0;
            //while (Marshal.ReadByte(ptr) != 0)
            //    strlen++;
        }

        [SuppressUnmanagedCodeSecurity]
        private delegate Cursor SDL_CreateColorCursor_d(Surface surface, int hot_x, int hot_y);
        private static SDL_CreateColorCursor_d SDL_CreateColorCursor_ptr = NativeLib.LoadFunctionPointer<SDL_CreateColorCursor_d>("SDL_CreateColorCursor");
        public static Cursor CreateColorCursor(Surface surface, int hot_x, int hot_y) => SDL_CreateColorCursor_ptr(surface, hot_x, hot_y);


        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_FreeCursor_d(Cursor cursor);
        private static SDL_FreeCursor_d SDL_FreeCursor_ptr = NativeLib.LoadFunctionPointer<SDL_FreeCursor_d>("SDL_FreeCursor");
        public static void FreeCursor(Cursor cursor) => SDL_FreeCursor_ptr(cursor);

        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_GetDefaultCursor_d();
        private static SDL_GetDefaultCursor_d SDL_GetDefaultCursor_ptr = NativeLib.LoadFunctionPointer<SDL_GetDefaultCursor_d>("SDL_GetDefaultCursor");
        public static IntPtr GetDefaultCursor() => SDL_GetDefaultCursor_ptr();

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_SetCursor_d(Cursor cursor);
        private static SDL_SetCursor_d SDL_SetCursor_ptr = NativeLib.LoadFunctionPointer<SDL_SetCursor_d>("SDL_SetCursor");
        public static void SetCursor(Cursor cursor) => SDL_SetCursor_ptr(cursor);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_AddEventWatch_d(EventFilter filter, IntPtr userdata);
        private static SDL_AddEventWatch_d SDL_AddEventWatch_ptr = NativeLib.LoadFunctionPointer<SDL_AddEventWatch_d>("SDL_AddEventWatch");
        public static void AddEventWatch(EventFilter filter, IntPtr userdata) => SDL_AddEventWatch_ptr(filter, userdata);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_AddEventWatch2_d(IntPtr filter, IntPtr userdata);
        private static SDL_AddEventWatch2_d SDL_AddEventWatch2_ptr = NativeLib.LoadFunctionPointer<SDL_AddEventWatch2_d>("SDL_AddEventWatch");
        public static void AddEventWatch(IntPtr filter, IntPtr userdata) => SDL_AddEventWatch2_ptr(filter, userdata);

        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_CreateRGBSurfaceFrom_d(IntPtr pixels, int width, int height, int depth, int pitch, uint Rmask, uint Gmask, uint Bmask, uint Amask);
        private static SDL_CreateRGBSurfaceFrom_d SDL_CreateRGBSurfaceFrom_ptr = NativeLib.LoadFunctionPointer<SDL_CreateRGBSurfaceFrom_d>("SDL_CreateRGBSurfaceFrom");
        public static IntPtr CreateRGBSurfaceFrom(IntPtr pixels, int width, int height, int depth, int pitch, uint Rmask, uint Gmask, uint Bmask, uint Amask)
            => SDL_CreateRGBSurfaceFrom_ptr(pixels, width, height, depth, pitch, Rmask, Gmask, Bmask, Amask);

        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_CreateWindow_d(string title, int x, int y, int w, int h, WindowFlags flags);
        private static SDL_CreateWindow_d SDL_CreateWindow_ptr = NativeLib.LoadFunctionPointer<SDL_CreateWindow_d>("SDL_CreateWindow");
        public static IntPtr CreateWindow(string title, int x, int y, int w, int h, WindowFlags flags)
            => SDL_CreateWindow_ptr(title, x, y, w, h, flags);

        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_CreateWindowFrom_d(IntPtr data);
        private static SDL_CreateWindowFrom_d SDL_CreateWindowFrom_ptr = NativeLib.LoadFunctionPointer<SDL_CreateWindowFrom_d>("SDL_CreateWindowFrom");
        public static IntPtr CreateWindowFrom(IntPtr data) => SDL_CreateWindowFrom_ptr(data);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_DelEventWatch2_d(EventFilter filter, IntPtr userdata);
        private static SDL_DelEventWatch2_d SDL_DelEventWatch2_ptr = NativeLib.LoadFunctionPointer<SDL_DelEventWatch2_d>("SDL_DelEventWatch");
        public static void DelEventWatch(EventFilter filter, IntPtr userdata) => SDL_DelEventWatch2_ptr(filter, userdata);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_DelEventWatch_d(IntPtr filter, IntPtr userdata);
        private static SDL_DelEventWatch_d SDL_DelEventWatch_ptr = NativeLib.LoadFunctionPointer<SDL_DelEventWatch_d>("SDL_DelEventWatch");
        public static void DelEventWatch(IntPtr filter, IntPtr userdata) => SDL_DelEventWatch_ptr(filter, userdata);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_DestroyWindow_d(IntPtr window);
        private static SDL_DestroyWindow_d SDL_DestroyWindow_ptr = NativeLib.LoadFunctionPointer<SDL_DestroyWindow_d>("SDL_DestroyWindow");
        public static void DestroyWindow(IntPtr window) => SDL_DestroyWindow_ptr(window);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_FreeSurface_d(IntPtr surface);
        private static SDL_FreeSurface_d SDL_FreeSurface_ptr = NativeLib.LoadFunctionPointer<SDL_FreeSurface_d>("SDL_FreeSurface");
        public static void FreeSurface(IntPtr surface) => SDL_FreeSurface_ptr(surface);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_Free_d(IntPtr memblock);
        private static SDL_Free_d SDL_Free_ptr = NativeLib.LoadFunctionPointer<SDL_Free_d>("SDL_free");
        public static void Free(IntPtr memblock) => SDL_Free_ptr(memblock);

        [SuppressUnmanagedCodeSecurity]
        private delegate EventState SDL_GameControllerEventState_d(EventState state);
        private static SDL_GameControllerEventState_d SDL_GameControllerEventState_ptr = NativeLib.LoadFunctionPointer<SDL_GameControllerEventState_d>("SDL_GameControllerEventState");
        public static EventState GameControllerEventState(EventState state) => SDL_GameControllerEventState_ptr(state);

        [SuppressUnmanagedCodeSecurity]
        private delegate short SDL_GameControllerGetAxis_d(IntPtr gamecontroller, GameControllerAxis axis);
        private static SDL_GameControllerGetAxis_d SDL_GameControllerGetAxis_ptr = NativeLib.LoadFunctionPointer<SDL_GameControllerGetAxis_d>("SDL_GameControllerGetAxis");
        public static short GameControllerGetAxis(IntPtr gamecontroller, GameControllerAxis axis) => SDL_GameControllerGetAxis_ptr(gamecontroller, axis);

        /// <summary>
        /// Gets the SDL joystick layer binding for the specified game controller axis
        /// </summary>
        /// <param name="gamecontroller">Pointer to a game controller instance returned by <c>GameControllerOpen</c>.</param>
        /// <param name="axis">A value from the <c>GameControllerAxis</c> enumeration</param>
        /// <returns>A GameControllerButtonBind instance describing the specified binding</returns>
        [SuppressUnmanagedCodeSecurity]
        private delegate GameControllerButtonBind SDL_GameControllerGetBindForAxis_d(IntPtr gamecontroller, GameControllerAxis axis);
        private static SDL_GameControllerGetBindForAxis_d SDL_GameControllerGetBindForAxis_ptr = NativeLib.LoadFunctionPointer<SDL_GameControllerGetBindForAxis_d>("SDL_GameControllerGetBindForAxis");
        public static GameControllerButtonBind GameControllerGetBindForAxis(IntPtr gamecontroller, GameControllerAxis axis)
            => SDL_GameControllerGetBindForAxis_ptr(gamecontroller, axis);

        /// <summary>
        /// Gets the SDL joystick layer binding for the specified game controller button
        /// </summary>
        /// <param name="gamecontroller">Pointer to a game controller instance returned by <c>GameControllerOpen</c>.</param>
        /// <param name="button">A value from the <c>GameControllerButton</c> enumeration</param>
        /// <returns>A GameControllerButtonBind instance describing the specified binding</returns>
        [SuppressUnmanagedCodeSecurity]
        private delegate GameControllerButtonBind SDL_GameControllerGetBindForButton_d(IntPtr gamecontroller, GameControllerButton button);
        private static SDL_GameControllerGetBindForButton_d SDL_GameControllerGetBindForButton_ptr = NativeLib.LoadFunctionPointer<SDL_GameControllerGetBindForButton_d>("SDL_GameControllerGetBindForButton");
        public static GameControllerButtonBind GameControllerGetBindForButton(IntPtr gamecontroller, GameControllerButton button)
            => SDL_GameControllerGetBindForButton_ptr(gamecontroller, button);

        /// <summary>
        /// Gets the current state of a button on a game controller.
        /// </summary>
        /// <param name="gamecontroller">A game controller handle previously opened with <c>GameControllerOpen</c>.</param>
        /// <param name="button">A zero-based <c>GameControllerButton</c> value.</param>
        /// <returns><c>true</c> if the specified button is pressed; <c>false</c> otherwise.</returns>
        [SuppressUnmanagedCodeSecurity]
        private delegate bool SDL_GameControllerGetButton_d(IntPtr gamecontroller, GameControllerButton button);
        private static SDL_GameControllerGetButton_d SDL_GameControllerGetButton_ptr = NativeLib.LoadFunctionPointer<SDL_GameControllerGetButton_d>("SDL_GameControllerGetButton");
        public static bool GameControllerGetButton(IntPtr gamecontroller, GameControllerButton button)
            => SDL_GameControllerGetButton_ptr(gamecontroller, button);

        /// <summary>
        /// Retrieve the joystick handle that corresponds to the specified game controller.
        /// </summary>
        /// <param name="gamecontroller">A game controller handle previously opened with <c>GameControllerOpen</c>.</param>
        /// <returns>A handle to a joystick, or IntPtr.Zero in case of error. The pointer is owned by the callee. Use <c>SDL.GetError</c> to retrieve error information</returns>
        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_GameControllerGetJoystick_d(IntPtr gamecontroller);
        private static SDL_GameControllerGetJoystick_d SDL_GameControllerGetJoystick_ptr = NativeLib.LoadFunctionPointer<SDL_GameControllerGetJoystick_d>("SDL_GameControllerGetJoystick");
        public static IntPtr GameControllerGetJoystick(IntPtr gamecontroller) => SDL_GameControllerGetJoystick_ptr(gamecontroller);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_GetCurrentDisplayMode_d(int displayIndex, out DisplayMode mode);
        private static SDL_GetCurrentDisplayMode_d SDL_GetCurrentDisplayMode_ptr = NativeLib.LoadFunctionPointer<SDL_GetCurrentDisplayMode_d>("SDL_GetCurrentDisplayMode");
        public static int GetCurrentDisplayMode(int displayIndex, out DisplayMode mode)
            => SDL_GetCurrentDisplayMode_ptr(displayIndex, out mode);

        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_GameControllerName_d(IntPtr gamecontroller);
        private static SDL_GameControllerName_d SDL_GameControllerName_ptr = NativeLib.LoadFunctionPointer<SDL_GameControllerName_d>("SDL_GameControllerName");
        static IntPtr GameControllerNameInternal(IntPtr gamecontroller) => SDL_GameControllerName_ptr(gamecontroller);

        /// <summary>
        /// Return the name for an openend game controller instance.
        /// </summary>
        /// <returns>The name of the game controller name.</returns>
        /// <param name="gamecontroller">Pointer to a game controller instance returned by <c>GameControllerOpen</c>.</param>
        public static string GameControllerName(IntPtr gamecontroller)
        {
            unsafe
            {
                return new string((sbyte*)GameControllerNameInternal(gamecontroller));
            }
        }

        /// <summary>
        /// Opens a game controller for use.
        /// </summary>
        /// <param name="joystick_index">
        /// A zero-based index for the game controller.
        /// This index is the value which will identify this controller in future controller events.
        /// </param>
        /// <returns>A handle to the game controller instance, or IntPtr.Zero in case of error.</returns>
        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_GameControllerOpen_d(int joystick_index);
        private static SDL_GameControllerOpen_d SDL_GameControllerOpen_ptr = NativeLib.LoadFunctionPointer<SDL_GameControllerOpen_d>("SDL_GameControllerOpen");
        public static IntPtr GameControllerOpen(int joystick_index) => SDL_GameControllerOpen_ptr(joystick_index);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_GetDisplayBounds_d(int displayIndex, out Rect rect);
        private static SDL_GetDisplayBounds_d SDL_GetDisplayBounds_ptr = NativeLib.LoadFunctionPointer<SDL_GetDisplayBounds_d>("SDL_GetDisplayBounds");
        public static int GetDisplayBounds(int displayIndex, out Rect rect) => SDL_GetDisplayBounds_ptr(displayIndex, out rect);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_GetDisplayMode_d(int displayIndex, int modeIndex, out DisplayMode mode);
        private static SDL_GetDisplayMode_d SDL_GetDisplayMode_ptr = NativeLib.LoadFunctionPointer<SDL_GetDisplayMode_d>("SDL_GetDisplayMode");
        public static int GetDisplayMode(int displayIndex, int modeIndex, out DisplayMode mode)
            => SDL_GetDisplayMode_ptr(displayIndex, modeIndex, out mode);

        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_GetError_d();
        private static SDL_GetError_d SDL_GetError_ptr = NativeLib.LoadFunctionPointer<SDL_GetError_d>("SDL_GetError");
        static IntPtr GetErrorInternal() => SDL_GetError_ptr();
        public static string GetError()
        {
            return IntPtrToString(GetErrorInternal());
        }

        [SuppressUnmanagedCodeSecurity]
        private delegate Keymod SDL_GetModState_d();
        private static SDL_GetModState_d SDL_GetModState_ptr = NativeLib.LoadFunctionPointer<SDL_GetModState_d>("SDL_GetModState");
        public static Keymod GetModState() => SDL_GetModState_ptr();

        [SuppressUnmanagedCodeSecurity]
        private delegate ButtonFlags SDL_GetMouseState_d(out int hx, out int hy);
        private static SDL_GetMouseState_d SDL_GetMouseState_ptr = NativeLib.LoadFunctionPointer<SDL_GetMouseState_d>("SDL_GetMouseState");
        public static ButtonFlags GetMouseState(out int hx, out int hy) => SDL_GetMouseState_ptr(out hx, out hy);

        [SuppressUnmanagedCodeSecurity]
        private delegate ButtonFlags SDL_GetGlobalMouseState_d(out int hx, out int hy);
        private static SDL_GetGlobalMouseState_d SDL_GetGlobalMouseState_ptr = NativeLib.LoadFunctionPointer<SDL_GetGlobalMouseState_d>("SDL_GetGlobalMouseState");
        public static ButtonFlags GetGlobalMouseState(out int hx, out int hy) => SDL_GetGlobalMouseState_ptr(out hx, out hy);
        
        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_GetNumDisplayModes_d(int displayIndex);
        private static SDL_GetNumDisplayModes_d SDL_GetNumDisplayModes_ptr = NativeLib.LoadFunctionPointer<SDL_GetNumDisplayModes_d>("SDL_GetNumDisplayModes");
        public static int GetNumDisplayModes(int displayIndex) => SDL_GetNumDisplayModes_ptr(displayIndex);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_GetNumVideoDisplays_d();
        private static SDL_GetNumVideoDisplays_d SDL_GetNumVideoDisplays_ptr = NativeLib.LoadFunctionPointer<SDL_GetNumVideoDisplays_d>("SDL_GetNumVideoDisplays");
        public static int GetNumVideoDisplays() => SDL_GetNumVideoDisplays_ptr();

        [SuppressUnmanagedCodeSecurity]
        private delegate Scancode SDL_GetScancodeFromKey_d(Keycode key);
        private static SDL_GetScancodeFromKey_d SDL_GetScancodeFromKey_ptr = NativeLib.LoadFunctionPointer<SDL_GetScancodeFromKey_d>("SDL_GetScancodeFromKey");
        public static Scancode GetScancodeFromKey(Keycode key) => SDL_GetScancodeFromKey_ptr(key);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_GetVersion_d(out Version version);
        private static SDL_GetVersion_d SDL_GetVersion_ptr = NativeLib.LoadFunctionPointer<SDL_GetVersion_d>("SDL_GetVersion");
        public static void GetVersion(out Version version) => SDL_GetVersion_ptr(out version);
        public static Version GetVersion()
        {
            Version v;
            GetVersion(out v);
            return v;
        }

        [SuppressUnmanagedCodeSecurity]
        private delegate uint SDL_GetWindowID_d(IntPtr window);
        private static SDL_GetWindowID_d SDL_GetWindowID_ptr = NativeLib.LoadFunctionPointer<SDL_GetWindowID_d>("SDL_GetWindowID");
        public static uint GetWindowID(IntPtr window) => SDL_GetWindowID_ptr(window);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_GetWindowPosition_d(IntPtr window, out int x, out int y);
        private static SDL_GetWindowPosition_d SDL_GetWindowPosition_ptr = NativeLib.LoadFunctionPointer<SDL_GetWindowPosition_d>("SDL_GetWindowPosition");
        public static void GetWindowPosition(IntPtr window, out int x, out int y) => SDL_GetWindowPosition_ptr(window, out x, out y);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_GetWindowSize_d(IntPtr window, out int w, out int h);
        private static SDL_GetWindowSize_d SDL_GetWindowSize_ptr = NativeLib.LoadFunctionPointer<SDL_GetWindowSize_d>("SDL_GetWindowSize");
        public static void GetWindowSize(IntPtr window, out int w, out int h) => SDL_GetWindowSize_ptr(window, out w, out h);

        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_GetWindowTitle_d(IntPtr window);
        private static SDL_GetWindowTitle_d SDL_GetWindowTitle_ptr = NativeLib.LoadFunctionPointer<SDL_GetWindowTitle_d>("SDL_GetWindowTitle");
        static IntPtr GetWindowTitlePrivate(IntPtr window) => SDL_GetWindowTitle_ptr(window);
        public static string GetWindowTitle(IntPtr window)
        {
            return Marshal.PtrToStringAnsi(GetWindowTitlePrivate(window));
        }

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_HideWindow_d(IntPtr window);
        private static SDL_HideWindow_d SDL_HideWindow_ptr = NativeLib.LoadFunctionPointer<SDL_HideWindow_d>("SDL_HideWindow");
        public static void HideWindow(IntPtr window) => SDL_HideWindow_ptr(window);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_DisableScreenSaver_d();
        private static SDL_DisableScreenSaver_d SDL_DisableScreenSaver_ptr = NativeLib.LoadFunctionPointer<SDL_DisableScreenSaver_d>("SDL_DisableScreenSaver");
        public static void DisableScreenSaver() => SDL_DisableScreenSaver_ptr();
        
        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_Init_d(SystemFlags flags);
        private static SDL_Init_d SDL_Init_ptr = NativeLib.LoadFunctionPointer<SDL_Init_d>("SDL_Init");
        public static int Init(SystemFlags flags) => SDL_Init_ptr(flags);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_InitSubSystem_d(SystemFlags flags);
        private static SDL_InitSubSystem_d SDL_InitSubSystem_ptr = NativeLib.LoadFunctionPointer<SDL_InitSubSystem_d>("SDL_InitSubSystem");
        public static int InitSubSystem(SystemFlags flags) => SDL_InitSubSystem_ptr(flags);

        /// <summary>
        /// Determines if the specified joystick is supported by the GameController API.
        /// </summary>
        /// <returns><c>true</c> if joystick_index is supported by the GameController API; <c>false</c> otherwise.</returns>
        /// <param name="joystick_index">The index of the joystick to check.</param>
        [SuppressUnmanagedCodeSecurity]
        private delegate bool SDL_IsGameController_d(int joystick_index);
        private static SDL_IsGameController_d SDL_IsGameController_ptr = NativeLib.LoadFunctionPointer<SDL_IsGameController_d>("SDL_IsGameController");
        public static bool IsGameController(int joystick_index) => SDL_IsGameController_ptr(joystick_index);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_JoystickClose_d(IntPtr joystick);
        private static SDL_JoystickClose_d SDL_JoystickClose_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickClose_d>("SDL_JoystickClose");
        public static void JoystickClose(IntPtr joystick) => SDL_JoystickClose_ptr(joystick);

        [SuppressUnmanagedCodeSecurity]
        private delegate EventState SDL_JoystickEventState_d(EventState enabled);
        private static SDL_JoystickEventState_d SDL_JoystickEventState_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickEventState_d>("SDL_JoystickEventState");
        public static EventState JoystickEventState(EventState enabled) => SDL_JoystickEventState_ptr(enabled);

        [SuppressUnmanagedCodeSecurity]
        private delegate short SDL_JoystickGetAxis_d(IntPtr joystick, int axis);
        private static SDL_JoystickGetAxis_d SDL_JoystickGetAxis_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickGetAxis_d>("SDL_JoystickGetAxis");
        public static short JoystickGetAxis(IntPtr joystick, int axis) => SDL_JoystickGetAxis_ptr(joystick, axis);

        [SuppressUnmanagedCodeSecurity]
        private delegate byte SDL_JoystickGetButton_d(IntPtr joystick, int button);
        private static SDL_JoystickGetButton_d SDL_JoystickGetButton_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickGetButton_d>("SDL_JoystickGetButton");
        public static byte JoystickGetButton(IntPtr joystick, int button) => SDL_JoystickGetButton_ptr(joystick, button);

        [SuppressUnmanagedCodeSecurity]
        private delegate JoystickGuid SDL_JoystickGetGUID_d(IntPtr joystick);
        private static SDL_JoystickGetGUID_d SDL_JoystickGetGUID_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickGetGUID_d>("SDL_JoystickGetGUID");
        public static JoystickGuid JoystickGetGUID(IntPtr joystick) => SDL_JoystickGetGUID_ptr(joystick);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_JoystickInstanceID_d(IntPtr joystick);
        private static SDL_JoystickInstanceID_d SDL_JoystickInstanceID_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickInstanceID_d>("SDL_JoystickInstanceID");
        public static int JoystickInstanceID(IntPtr joystick) => SDL_JoystickInstanceID_ptr(joystick);
        
        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_JoystickName_d(IntPtr joystick);
        private static SDL_JoystickName_d SDL_JoystickName_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickName_d>("SDL_JoystickName");
        static IntPtr JoystickNameInternal(IntPtr joystick) => SDL_JoystickName_ptr(joystick);
        public static string JoystickName(IntPtr joystick)
        {
            unsafe
            {
                return new string((sbyte*)JoystickNameInternal(joystick));
            }
        }

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_JoystickNumAxes_d(IntPtr joystick);
        private static SDL_JoystickNumAxes_d SDL_JoystickNumAxes_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickNumAxes_d>("SDL_JoystickNumAxes");
        public static int JoystickNumAxes(IntPtr joystick) => SDL_JoystickNumAxes_ptr(joystick);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_JoystickNumBalls_d(IntPtr joystick);
        private static SDL_JoystickNumBalls_d SDL_JoystickNumBalls_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickNumBalls_d>("SDL_JoystickNumBalls");
        public static int JoystickNumBalls(IntPtr joystick) => SDL_JoystickNumBalls_ptr(joystick);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_JoystickNumButtons_d(IntPtr joystick);
        private static SDL_JoystickNumButtons_d SDL_JoystickNumButtons_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickNumButtons_d>("SDL_JoystickNumButtons");
        public static int JoystickNumButtons(IntPtr joystick) => SDL_JoystickNumButtons_ptr(joystick);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_JoystickNumHats_d(IntPtr joystick);
        private static SDL_JoystickNumHats_d SDL_JoystickNumHats_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickNumHats_d>("SDL_JoystickNumHats");
        public static int JoystickNumHats(IntPtr joystick) => SDL_JoystickNumHats_ptr(joystick);

        [SuppressUnmanagedCodeSecurity]
        private delegate IntPtr SDL_JoystickOpen_d(int device_index);
        private static SDL_JoystickOpen_d SDL_JoystickOpen_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickOpen_d>("SDL_JoystickOpen");
        public static IntPtr JoystickOpen(int device_index) => SDL_JoystickOpen_ptr(device_index);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_JoystickUpdate_d();
        private static SDL_JoystickUpdate_d SDL_JoystickUpdate_ptr = NativeLib.LoadFunctionPointer<SDL_JoystickUpdate_d>("SDL_JoystickUpdate");
        public static void JoystickUpdate() => SDL_JoystickUpdate_ptr();

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_MaximizeWindow_d(IntPtr window);
        private static SDL_MaximizeWindow_d SDL_MaximizeWindow_ptr = NativeLib.LoadFunctionPointer<SDL_MaximizeWindow_d>("SDL_MaximizeWindow");
        public static void MaximizeWindow(IntPtr window) => SDL_MaximizeWindow_ptr(window);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_MinimizeWindow_d(IntPtr window);
        private static SDL_MinimizeWindow_d SDL_MinimizeWindow_ptr = NativeLib.LoadFunctionPointer<SDL_MinimizeWindow_d>("SDL_MinimizeWindow");
        public static void MinimizeWindow(IntPtr window) => SDL_MinimizeWindow_ptr(window);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_NumJoysticks_d();
        private static SDL_NumJoysticks_d SDL_NumJoysticks_ptr = NativeLib.LoadFunctionPointer<SDL_NumJoysticks_d>("SDL_NumJoysticks");
        public static int NumJoysticks() => SDL_NumJoysticks_ptr();

        public static int PeepEvents(ref Event e, EventAction action, EventType min, EventType max)
        {
            unsafe
            {
                fixed (Event* pe = &e)
                {
                    return PeepEvents(pe, 1, action, min, max);
                }
            }
        }

        public static int PeepEvents(Event[] e, int count, EventAction action, EventType min, EventType max)
        {
            if (e == null)
            {
                throw new ArgumentNullException();
            }
            if (count <= 0 || count > e.Length)
            {
                throw new ArgumentOutOfRangeException();
            }

            unsafe
            {
                fixed (Event* pe = e)
                {
                    return PeepEvents(pe, count, action, min, max);
                }
            }
        }

        [SuppressUnmanagedCodeSecurity]
        private unsafe delegate int SDL_PeepEvents_d(Event* e, int count, EventAction action, EventType min, EventType max);
        private static SDL_PeepEvents_d SDL_PeepEvents_ptr = NativeLib.LoadFunctionPointer<SDL_PeepEvents_d>("SDL_PeepEvents");
        unsafe static int PeepEvents(Event* e, int count, EventAction action, EventType min, EventType max)
            => SDL_PeepEvents_ptr(e, count, action, min, max);


        [SuppressUnmanagedCodeSecurity]
        private delegate bool SDL_PixelFormatEnumToMasks_d(uint format, out int bpp, out uint rmask, out uint gmask, out uint bmask, out uint amask);
        private static SDL_PixelFormatEnumToMasks_d SDL_PixelFormatEnumToMasks_ptr = NativeLib.LoadFunctionPointer<SDL_PixelFormatEnumToMasks_d>("SDL_PixelFormatEnumToMasks");
        public static bool PixelFormatEnumToMasks(uint format, out int bpp, out uint rmask, out uint gmask, out uint bmask, out uint amask)
            => SDL_PixelFormatEnumToMasks_ptr(format, out bpp, out rmask, out gmask, out bmask, out amask);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_PollEvent_d(out Event e);
        private static SDL_PollEvent_d SDL_PollEvent_ptr = NativeLib.LoadFunctionPointer<SDL_PollEvent_d>("SDL_PollEvent");
        public static int PollEvent(out Event e) => SDL_PollEvent_ptr(out e);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_PumpEvents_d();
        private static SDL_PumpEvents_d SDL_PumpEvents_ptr = NativeLib.LoadFunctionPointer<SDL_PumpEvents_d>("SDL_PumpEvents");
        public static void PumpEvents() => SDL_PumpEvents_ptr();

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_PushEvent_d(ref Event @event);
        private static SDL_PushEvent_d SDL_PushEvent_ptr = NativeLib.LoadFunctionPointer<SDL_PushEvent_d>("SDL_PushEvent");
        public static int PushEvent(ref Event @event) => SDL_PushEvent_ptr(ref @event);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_RaiseWindow_d(IntPtr window);
        private static SDL_RaiseWindow_d SDL_RaiseWindow_ptr = NativeLib.LoadFunctionPointer<SDL_RaiseWindow_d>("SDL_RaiseWindow");
        public static void RaiseWindow(IntPtr window) => SDL_RaiseWindow_ptr(window);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_RestoreWindow_d(IntPtr window);
        private static SDL_RestoreWindow_d SDL_RestoreWindow_ptr = NativeLib.LoadFunctionPointer<SDL_RestoreWindow_d>("SDL_RestoreWindow");
        public static void RestoreWindow(IntPtr window) => SDL_RestoreWindow_ptr(window);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_SetRelativeMouseMode_d(bool enabled);
        private static SDL_SetRelativeMouseMode_d SDL_SetRelativeMouseMode_ptr = NativeLib.LoadFunctionPointer<SDL_SetRelativeMouseMode_d>("SDL_SetRelativeMouseMode");
        public static int SetRelativeMouseMode(bool enabled) => SDL_SetRelativeMouseMode_ptr(enabled);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_SetWindowBordered_d(IntPtr window, bool bordered);
        private static SDL_SetWindowBordered_d SDL_SetWindowBordered_ptr = NativeLib.LoadFunctionPointer<SDL_SetWindowBordered_d>("SDL_SetWindowBordered");
        public static void SetWindowBordered(IntPtr window, bool bordered) => SDL_SetWindowBordered_ptr(window, bordered);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_SetWindowFullscreen_d(IntPtr window, uint flags);
        private static SDL_SetWindowFullscreen_d SDL_SetWindowFullscreen_ptr = NativeLib.LoadFunctionPointer<SDL_SetWindowFullscreen_d>("SDL_SetWindowFullscreen");
        public static int SetWindowFullscreen(IntPtr window, uint flags) => SDL_SetWindowFullscreen_ptr(window, flags);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_SetWindowGrab_d(IntPtr window, bool grabbed);
        private static SDL_SetWindowGrab_d SDL_SetWindowGrab_ptr = NativeLib.LoadFunctionPointer<SDL_SetWindowGrab_d>("SDL_SetWindowGrab");
        public static void SetWindowGrab(IntPtr window, bool grabbed) => SDL_SetWindowGrab_ptr(window, grabbed);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_SetWindowIcon_d(IntPtr window, IntPtr icon);
        private static SDL_SetWindowIcon_d SDL_SetWindowIcon_ptr = NativeLib.LoadFunctionPointer<SDL_SetWindowIcon_d>("SDL_SetWindowIcon");
        public static void SetWindowIcon(IntPtr window, IntPtr icon) => SDL_SetWindowIcon_ptr(window, icon);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_SetWindowPosition_d(IntPtr window, int x, int y);
        private static SDL_SetWindowPosition_d SDL_SetWindowPosition_ptr = NativeLib.LoadFunctionPointer<SDL_SetWindowPosition_d>("SDL_SetWindowPosition");
        public static void SetWindowPosition(IntPtr window, int x, int y) => SDL_SetWindowPosition_ptr(window, x, y);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_SetWindowSize_d(IntPtr window, int x, int y);
        private static SDL_SetWindowSize_d SDL_SetWindowSize_ptr = NativeLib.LoadFunctionPointer<SDL_SetWindowSize_d>("SDL_SetWindowSize");
        public static void SetWindowSize(IntPtr window, int x, int y) => SDL_SetWindowSize_ptr(window, x, y);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_SetWindowTitle_d(IntPtr window, string title);
        private static SDL_SetWindowTitle_d SDL_SetWindowTitle_ptr = NativeLib.LoadFunctionPointer<SDL_SetWindowTitle_d>("SDL_SetWindowTitle");
        public static void SetWindowTitle(IntPtr window, string title) => SDL_SetWindowTitle_ptr(window, title);

        [SuppressUnmanagedCodeSecurity]
        private delegate int SDL_ShowCursor_d(bool toggle);
        private static SDL_ShowCursor_d SDL_ShowCursor_ptr = NativeLib.LoadFunctionPointer<SDL_ShowCursor_d>("SDL_ShowCursor");
        public static int ShowCursor(bool toggle) => SDL_ShowCursor_ptr(toggle);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_ShowWindow_d(IntPtr window);
        private static SDL_ShowWindow_d SDL_ShowWindow_ptr = NativeLib.LoadFunctionPointer<SDL_ShowWindow_d>("SDL_ShowWindow");
        public static void ShowWindow(IntPtr window) => SDL_ShowWindow_ptr(window);

        [SuppressUnmanagedCodeSecurity]
        private delegate bool SDL_WasInit_d(SystemFlags flags);
        private static SDL_WasInit_d SDL_WasInit_ptr = NativeLib.LoadFunctionPointer<SDL_WasInit_d>("SDL_WasInit");
        public static bool WasInit(SystemFlags flags) => SDL_WasInit_ptr(flags);

        [SuppressUnmanagedCodeSecurity]
        private delegate void SDL_WarpMouseInWindow_d(IntPtr window, int x, int y);
        private static SDL_WarpMouseInWindow_d SDL_WarpMouseInWindow_ptr = NativeLib.LoadFunctionPointer<SDL_WarpMouseInWindow_d>("SDL_WarpMouseInWindow");
        public static void WarpMouseInWindow(IntPtr window, int x, int y) => SDL_WarpMouseInWindow_ptr(window, x, y);

        [SuppressUnmanagedCodeSecurity]
        private delegate bool SDL_WarpMouseGlobal_d(int x, int y);
        private static SDL_WarpMouseGlobal_d SDL_WarpMouseGlobal_ptr = NativeLib.LoadFunctionPointer<SDL_WarpMouseGlobal_d>("SDL_WarpMouseGlobal");
        public static bool WarpMouseGlobal(int x, int y) => SDL_WarpMouseGlobal_ptr(x, y);

        /// <summary>
        /// Retrieves driver-dependent window information.
        /// </summary>
        /// <param name="window">
        /// The window about which information is being requested.
        /// </param>
        /// <param name="info">
        /// Returns driver-dependent information about the specified window.
        /// </param>
        /// <returns>
        /// True, if the function is implemented and the version number of the info struct is valid;
        /// false, otherwise.
        /// </returns>
        public static bool GetWindowWMInfo(IntPtr window, out SysWMInfo info)
        {
            info = new SysWMInfo();
            info.Version = GetVersion();
            return GetWindowWMInfoInternal(window, ref info);
        }

        [SuppressUnmanagedCodeSecurity]
        private delegate bool SDL_GetWindowWMInfo_d(IntPtr window, ref SysWMInfo info);
        private static SDL_GetWindowWMInfo_d SDL_GetWindowWMInfo_ptr = NativeLib.LoadFunctionPointer<SDL_GetWindowWMInfo_d>("SDL_GetWindowWMInfoInternal");
        static bool GetWindowWMInfoInternal(IntPtr window, ref SysWMInfo info) => SDL_GetWindowWMInfo_ptr(window, ref info);

        public partial class GL
        {
            [SuppressUnmanagedCodeSecurity]
            private delegate IntPtr SDL_GL_CreateContext_d(IntPtr window);
            private static SDL_GL_CreateContext_d SDL_GL_CreateContext_ptr = NativeLib.LoadFunctionPointer<SDL_GL_CreateContext_d>("SDL_GL_CreateContext");
            public static IntPtr CreateContext(IntPtr window) => SDL_GL_CreateContext_ptr(window);

            [SuppressUnmanagedCodeSecurity]
            private delegate void SDL_GL_DeleteContext_d(IntPtr context);
            private static SDL_GL_DeleteContext_d SDL_GL_DeleteContext_ptr = NativeLib.LoadFunctionPointer<SDL_GL_DeleteContext_d>("SDL_GL_DeleteContext");
            public static void DeleteContext(IntPtr context) => SDL_GL_DeleteContext_ptr(context);

            [SuppressUnmanagedCodeSecurity]
            private delegate int SDL_GL_GetAttribute_d(ContextAttribute attr, out int value);
            private static SDL_GL_GetAttribute_d SDL_GL_GetAttribute_ptr = NativeLib.LoadFunctionPointer<SDL_GL_GetAttribute_d>("SDL_GL_GetAttribute");
            public static int GetAttribute(ContextAttribute attr, out int value) => SDL_GL_GetAttribute_ptr(attr, out value);

            [SuppressUnmanagedCodeSecurity]
            private delegate IntPtr SDL_GL_GetCurrentContext_d();
            private static SDL_GL_GetCurrentContext_d SDL_GL_GetCurrentContext_ptr = NativeLib.LoadFunctionPointer<SDL_GL_GetCurrentContext_d>("SDL_GL_GetCurrentContext");
            public static IntPtr GetCurrentContext() => SDL_GL_GetCurrentContext_ptr();

            [SuppressUnmanagedCodeSecurity]
            private delegate void SDL_GL_GetDrawableSize_d(IntPtr window, out int w, out int h);
            private static SDL_GL_GetDrawableSize_d SDL_GL_GetDrawableSize_ptr = NativeLib.LoadFunctionPointer<SDL_GL_GetDrawableSize_d>("SDL_GL_GetDrawableSize");
            public static void GetDrawableSize(IntPtr window, out int w, out int h) => SDL_GL_GetDrawableSize_ptr(window, out w, out h);

            [SuppressUnmanagedCodeSecurity]
            private delegate IntPtr SDL_GL_GetProcAddress_d(IntPtr proc);
            private static SDL_GL_GetProcAddress_d SDL_GL_GetProcAddress_ptr = NativeLib.LoadFunctionPointer<SDL_GL_GetProcAddress_d>("SDL_GL_GetProcAddress");
            public static IntPtr GetProcAddress(IntPtr proc) => SDL_GL_GetProcAddress_ptr(proc);
            public static IntPtr GetProcAddress(string proc)
            {
                IntPtr p = Marshal.StringToHGlobalAnsi(proc);
                try
                {
                    return GetProcAddress(p);
                }
                finally
                {
                    Marshal.FreeHGlobal(p);
                }
            }

            [SuppressUnmanagedCodeSecurity]
            private delegate int SDL_GL_GetSwapInterval_d();
            private static SDL_GL_GetSwapInterval_d SDL_GL_GetSwapInterval_ptr = NativeLib.LoadFunctionPointer<SDL_GL_GetSwapInterval_d>("SDL_GL_GetSwapInterval");
            public static int GetSwapInterval() => SDL_GL_GetSwapInterval_ptr();

            [SuppressUnmanagedCodeSecurity]
            private delegate int SDL_GL_MakeCurrent_d(IntPtr window, IntPtr context);
            private static SDL_GL_MakeCurrent_d SDL_GL_MakeCurrent_ptr = NativeLib.LoadFunctionPointer<SDL_GL_MakeCurrent_d>("SDL_GL_MakeCurrent");
            public static int MakeCurrent(IntPtr window, IntPtr context) => SDL_GL_MakeCurrent_ptr(window, context);

            [SuppressUnmanagedCodeSecurity]
            private delegate int SDL_GL_SetAttribute_d(ContextAttribute attr, int value);
            private static SDL_GL_SetAttribute_d SDL_GL_SetAttribute_ptr = NativeLib.LoadFunctionPointer<SDL_GL_SetAttribute_d>("SDL_GL_SetAttribute");
            public static int SetAttribute(ContextAttribute attr, int value) => SDL_GL_SetAttribute_ptr(attr, value);
            public static int SetAttribute(ContextAttribute attr, ContextFlags value)
            {
                return SetAttribute(attr, (int)value);
            }
            public static int SetAttribute(ContextAttribute attr, ContextProfileFlags value)
            {
                return SetAttribute(attr, (int)value);
            }

            [SuppressUnmanagedCodeSecurity]
            private delegate int SDL_GL_SetSwapInterval_d(int interval);
            private static SDL_GL_SetSwapInterval_d SDL_GL_SetSwapInterval_ptr = NativeLib.LoadFunctionPointer<SDL_GL_SetSwapInterval_d>("SDL_GL_SetSwapInterval");
            public static int SetSwapInterval(int interval) => SDL_GL_SetSwapInterval_ptr(interval);

            [SuppressUnmanagedCodeSecurity]
            private delegate void SDL_GL_SwapWindow_d(IntPtr window);
            private static SDL_GL_SwapWindow_d SDL_GL_SwapWindow_ptr = NativeLib.LoadFunctionPointer<SDL_GL_SwapWindow_d>("SDL_GL_SwapWindow");
            public static void SwapWindow(IntPtr window) => SDL_GL_SwapWindow_ptr(window);
        }
    }

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate int EventFilter(IntPtr userdata, IntPtr @event);

    internal enum Button : byte
    {
        Left = 1,
        Middle,
        Right,
        X1,
        X2
    }

    [Flags]
    internal enum ButtonFlags
    {
        Left = 1 << (Button.Left - 1),
        Middle = 1 << (Button.Middle - 1),
        Right = 1 << (Button.Right - 1),
        X1 = 1 << (Button.X1 - 1),
        X2 = 1 << (Button.X2 - 1),
    }

    internal enum ContextAttribute
    {
        RED_SIZE,
        GREEN_SIZE,
        BLUE_SIZE,
        ALPHA_SIZE,
        BUFFER_SIZE,
        DOUBLEBUFFER,
        DEPTH_SIZE,
        STENCIL_SIZE,
        ACCUM_RED_SIZE,
        ACCUM_GREEN_SIZE,
        ACCUM_BLUE_SIZE,
        ACCUM_ALPHA_SIZE,
        STEREO,
        MULTISAMPLEBUFFERS,
        MULTISAMPLESAMPLES,
        ACCELERATED_VISUAL,
        RETAINED_BACKING,
        CONTEXT_MAJOR_VERSION,
        CONTEXT_MINOR_VERSION,
        CONTEXT_EGL,
        CONTEXT_FLAGS,
        CONTEXT_PROFILE_MASK,
        SHARE_WITH_CURRENT_CONTEXT
    }

    [Flags]
    internal enum ContextFlags
    {
        DEBUG = 0x0001,
        FORWARD_COMPATIBLE = 0x0002,
        ROBUST_ACCESS = 0x0004,
        RESET_ISOLATION = 0x0008
    }

    [Flags]
    internal enum ContextProfileFlags
    {
        CORE = 0x0001,
        COMPATIBILITY = 0x0002,
        ES = 0x0004
    }

    internal enum EventAction
    {
        Add,
        Peek,
        Get
    }

    internal enum EventState
    {
        Query = -1,
        Ignore = 0,
        Enable = 1
    }

    internal enum EventType
    {
        FIRSTEVENT = 0,
        QUIT = 0x100,
        WINDOWEVENT = 0x200,
        SYSWMEVENT,
        KEYDOWN = 0x300,
        KEYUP,
        TEXTEDITING,
        TEXTINPUT,
        MOUSEMOTION = 0x400,
        MOUSEBUTTONDOWN,
        MOUSEBUTTONUP,
        MOUSEWHEEL,
        JOYAXISMOTION = 0x600,
        JOYBALLMOTION,
        JOYHATMOTION,
        JOYBUTTONDOWN,
        JOYBUTTONUP,
        JOYDEVICEADDED,
        JOYDEVICEREMOVED,
        CONTROLLERAXISMOTION = 0x650,
        CONTROLLERBUTTONDOWN,
        CONTROLLERBUTTONUP,
        CONTROLLERDEVICEADDED,
        CONTROLLERDEVICEREMOVED,
        CONTROLLERDEVICEREMAPPED,
        FINGERDOWN = 0x700,
        FINGERUP,
        FINGERMOTION,
        DOLLARGESTURE = 0x800,
        DOLLARRECORD,
        MULTIGESTURE,
        CLIPBOARDUPDATE = 0x900,
        DROPFILE = 0x1000,
        USEREVENT = 0x8000,
        LASTEVENT = 0xFFFF
    }

    internal enum GameControllerAxis : byte
    {
        Invalid = 0xff,
        LeftX = 0,
        LeftY,
        RightX,
        RightY,
        TriggerLeft,
        TriggerRight,
        Max
    }

    internal enum GameControllerButton : byte
    {
        INVALID = 0xff,
        A = 0,
        B,
        X,
        Y,
        BACK,
        GUIDE,
        START,
        LEFTSTICK,
        RIGHTSTICK,
        LEFTSHOULDER,
        RIGHTSHOULDER,
        DPAD_UP,
        DPAD_DOWN,
        DPAD_LEFT,
        DPAD_RIGHT,
        Max
    }

    internal enum GameControllerBindType : byte
    {
        None = 0,
        Button,
        Axis,
        Hat
    }

    [Flags]
    internal enum HatPosition : byte
    {
        Centered = 0x00,
        Up = 0x01,
        Right = 0x02,
        Down = 0x04,
        Left = 0x08,
        RightUp = Right | Up,
        RightDown = Right | Down,
        LeftUp = Left | Up,
        LeftDown = Left | Down
    }

    internal enum Keycode
    {
        UNKNOWN = 0,
        RETURN = '\r',
        ESCAPE = 27, // '\033' octal
        BACKSPACE = '\b',
        TAB = '\t',
        SPACE = ' ',
        EXCLAIM = '!',
        QUOTEDBL = '"',
        HASH = '#',
        PERCENT = '%',
        DOLLAR = '$',
        AMPERSAND = '&',
        QUOTE = '\'',
        LEFTPAREN = '(',
        RIGHTPAREN = ')',
        ASTERISK = '*',
        PLUS = '+',
        COMMA = ',',
        MINUS = '-',
        PERIOD = '.',
        SLASH = '/',
        Num0 = '0',
        Num1 = '1',
        Num2 = '2',
        Num3 = '3',
        Num4 = '4',
        Num5 = '5',
        Num6 = '6',
        Num7 = '7',
        Num8 = '8',
        Num9 = '9',
        COLON = ':',
        SEMICOLON = ';',
        LESS = '<',
        EQUALS = '=',
        GREATER = '>',
        QUESTION = '?',
        AT = '@',
        LEFTBRACKET = '[',
        BACKSLASH = '\\',
        RIGHTBRACKET = ']',
        CARET = '^',
        UNDERSCORE = '_',
        BACKQUOTE = '`',
        a = 'a',
        b = 'b',
        c = 'c',
        d = 'd',
        e = 'e',
        f = 'f',
        g = 'g',
        h = 'h',
        i = 'i',
        j = 'j',
        k = 'k',
        l = 'l',
        m = 'm',
        n = 'n',
        o = 'o',
        p = 'p',
        q = 'q',
        r = 'r',
        s = 's',
        t = 't',
        u = 'u',
        v = 'v',
        w = 'w',
        x = 'x',
        y = 'y',
        z = 'z',
        CAPSLOCK = (1 << 30) | (int)Scancode.CAPSLOCK,
        F1 = (1 << 30) | (int)Scancode.F1,
        F2 = (1 << 30) | (int)Scancode.F2,
        F3 = (1 << 30) | (int)Scancode.F3,
        F4 = (1 << 30) | (int)Scancode.F4,
        F5 = (1 << 30) | (int)Scancode.F5,
        F6 = (1 << 30) | (int)Scancode.F6,
        F7 = (1 << 30) | (int)Scancode.F7,
        F8 = (1 << 30) | (int)Scancode.F8,
        F9 = (1 << 30) | (int)Scancode.F9,
        F10 = (1 << 30) | (int)Scancode.F10,
        F11 = (1 << 30) | (int)Scancode.F11,
        F12 = (1 << 30) | (int)Scancode.F12,
        PRINTSCREEN = (1 << 30) | (int)Scancode.PRINTSCREEN,
        SCROLLLOCK = (1 << 30) | (int)Scancode.SCROLLLOCK,
        PAUSE = (1 << 30) | (int)Scancode.PAUSE,
        INSERT = (1 << 30) | (int)Scancode.INSERT,
        HOME = (1 << 30) | (int)Scancode.HOME,
        PAGEUP = (1 << 30) | (int)Scancode.PAGEUP,
        DELETE = 127, // '\177' octal
        END = (1 << 30) | (int)Scancode.END,
        PAGEDOWN = (1 << 30) | (int)Scancode.PAGEDOWN,
        RIGHT = (1 << 30) | (int)Scancode.RIGHT,
        LEFT = (1 << 30) | (int)Scancode.LEFT,
        DOWN = (1 << 30) | (int)Scancode.DOWN,
        UP = (1 << 30) | (int)Scancode.UP,
        NUMLOCKCLEAR = (1 << 30) | (int)Scancode.NUMLOCKCLEAR,
        KP_DIVIDE = (1 << 30) | (int)Scancode.KP_DIVIDE,
        KP_MULTIPLY = (1 << 30) | (int)Scancode.KP_MULTIPLY,
        KP_MINUS = (1 << 30) | (int)Scancode.KP_MINUS,
        KP_PLUS = (1 << 30) | (int)Scancode.KP_PLUS,
        KP_ENTER = (1 << 30) | (int)Scancode.KP_ENTER,
        KP_1 = (1 << 30) | (int)Scancode.KP_1,
        KP_2 = (1 << 30) | (int)Scancode.KP_2,
        KP_3 = (1 << 30) | (int)Scancode.KP_3,
        KP_4 = (1 << 30) | (int)Scancode.KP_4,
        KP_5 = (1 << 30) | (int)Scancode.KP_5,
        KP_6 = (1 << 30) | (int)Scancode.KP_6,
        KP_7 = (1 << 30) | (int)Scancode.KP_7,
        KP_8 = (1 << 30) | (int)Scancode.KP_8,
        KP_9 = (1 << 30) | (int)Scancode.KP_9,
        KP_0 = (1 << 30) | (int)Scancode.KP_0,
        KP_PERIOD = (1 << 30) | (int)Scancode.KP_PERIOD,
        APPLICATION = (1 << 30) | (int)Scancode.APPLICATION,
        POWER = (1 << 30) | (int)Scancode.POWER,
        KP_EQUALS = (1 << 30) | (int)Scancode.KP_EQUALS,
        F13 = (1 << 30) | (int)Scancode.F13,
        F14 = (1 << 30) | (int)Scancode.F14,
        F15 = (1 << 30) | (int)Scancode.F15,
        F16 = (1 << 30) | (int)Scancode.F16,
        F17 = (1 << 30) | (int)Scancode.F17,
        F18 = (1 << 30) | (int)Scancode.F18,
        F19 = (1 << 30) | (int)Scancode.F19,
        F20 = (1 << 30) | (int)Scancode.F20,
        F21 = (1 << 30) | (int)Scancode.F21,
        F22 = (1 << 30) | (int)Scancode.F22,
        F23 = (1 << 30) | (int)Scancode.F23,
        F24 = (1 << 30) | (int)Scancode.F24,
        EXECUTE = (1 << 30) | (int)Scancode.EXECUTE,
        HELP = (1 << 30) | (int)Scancode.HELP,
        MENU = (1 << 30) | (int)Scancode.MENU,
        SELECT = (1 << 30) | (int)Scancode.SELECT,
        STOP = (1 << 30) | (int)Scancode.STOP,
        AGAIN = (1 << 30) | (int)Scancode.AGAIN,
        UNDO = (1 << 30) | (int)Scancode.UNDO,
        CUT = (1 << 30) | (int)Scancode.CUT,
        COPY = (1 << 30) | (int)Scancode.COPY,
        PASTE = (1 << 30) | (int)Scancode.PASTE,
        FIND = (1 << 30) | (int)Scancode.FIND,
        MUTE = (1 << 30) | (int)Scancode.MUTE,
        VOLUMEUP = (1 << 30) | (int)Scancode.VOLUMEUP,
        VOLUMEDOWN = (1 << 30) | (int)Scancode.VOLUMEDOWN,
        KP_COMMA = (1 << 30) | (int)Scancode.KP_COMMA,
        KP_EQUALSAS400 = (1 << 30) | (int)Scancode.KP_EQUALSAS400,
        ALTERASE = (1 << 30) | (int)Scancode.ALTERASE,
        SYSREQ = (1 << 30) | (int)Scancode.SYSREQ,
        CANCEL = (1 << 30) | (int)Scancode.CANCEL,
        CLEAR = (1 << 30) | (int)Scancode.CLEAR,
        PRIOR = (1 << 30) | (int)Scancode.PRIOR,
        RETURN2 = (1 << 30) | (int)Scancode.RETURN2,
        SEPARATOR = (1 << 30) | (int)Scancode.SEPARATOR,
        OUT = (1 << 30) | (int)Scancode.OUT,
        OPER = (1 << 30) | (int)Scancode.OPER,
        CLEARAGAIN = (1 << 30) | (int)Scancode.CLEARAGAIN,
        CRSEL = (1 << 30) | (int)Scancode.CRSEL,
        EXSEL = (1 << 30) | (int)Scancode.EXSEL,
        KP_00 = (1 << 30) | (int)Scancode.KP_00,
        KP_000 = (1 << 30) | (int)Scancode.KP_000,
        THOUSANDSSEPARATOR = (1 << 30) | (int)Scancode.THOUSANDSSEPARATOR,
        DECIMALSEPARATOR = (1 << 30) | (int)Scancode.DECIMALSEPARATOR,
        CURRENCYUNIT = (1 << 30) | (int)Scancode.CURRENCYUNIT,
        CURRENCYSUBUNIT = (1 << 30) | (int)Scancode.CURRENCYSUBUNIT,
        KP_LEFTPAREN = (1 << 30) | (int)Scancode.KP_LEFTPAREN,
        KP_RIGHTPAREN = (1 << 30) | (int)Scancode.KP_RIGHTPAREN,
        KP_LEFTBRACE = (1 << 30) | (int)Scancode.KP_LEFTBRACE,
        KP_RIGHTBRACE = (1 << 30) | (int)Scancode.KP_RIGHTBRACE,
        KP_TAB = (1 << 30) | (int)Scancode.KP_TAB,
        KP_BACKSPACE = (1 << 30) | (int)Scancode.KP_BACKSPACE,
        KP_A = (1 << 30) | (int)Scancode.KP_A,
        KP_B = (1 << 30) | (int)Scancode.KP_B,
        KP_C = (1 << 30) | (int)Scancode.KP_C,
        KP_D = (1 << 30) | (int)Scancode.KP_D,
        KP_E = (1 << 30) | (int)Scancode.KP_E,
        KP_F = (1 << 30) | (int)Scancode.KP_F,
        KP_XOR = (1 << 30) | (int)Scancode.KP_XOR,
        KP_POWER = (1 << 30) | (int)Scancode.KP_POWER,
        KP_PERCENT = (1 << 30) | (int)Scancode.KP_PERCENT,
        KP_LESS = (1 << 30) | (int)Scancode.KP_LESS,
        KP_GREATER = (1 << 30) | (int)Scancode.KP_GREATER,
        KP_AMPERSAND = (1 << 30) | (int)Scancode.KP_AMPERSAND,
        KP_DBLAMPERSAND = (1 << 30) | (int)Scancode.KP_DBLAMPERSAND,
        KP_VERTICALBAR = (1 << 30) | (int)Scancode.KP_VERTICALBAR,
        KP_DBLVERTICALBAR = (1 << 30) | (int)Scancode.KP_DBLVERTICALBAR,
        KP_COLON = (1 << 30) | (int)Scancode.KP_COLON,
        KP_HASH = (1 << 30) | (int)Scancode.KP_HASH,
        KP_SPACE = (1 << 30) | (int)Scancode.KP_SPACE,
        KP_AT = (1 << 30) | (int)Scancode.KP_AT,
        KP_EXCLAM = (1 << 30) | (int)Scancode.KP_EXCLAM,
        KP_MEMSTORE = (1 << 30) | (int)Scancode.KP_MEMSTORE,
        KP_MEMRECALL = (1 << 30) | (int)Scancode.KP_MEMRECALL,
        KP_MEMCLEAR = (1 << 30) | (int)Scancode.KP_MEMCLEAR,
        KP_MEMADD = (1 << 30) | (int)Scancode.KP_MEMADD,
        KP_MEMSUBTRACT = (1 << 30) | (int)Scancode.KP_MEMSUBTRACT,
        KP_MEMMULTIPLY = (1 << 30) | (int)Scancode.KP_MEMMULTIPLY,
        KP_MEMDIVIDE = (1 << 30) | (int)Scancode.KP_MEMDIVIDE,
        KP_PLUSMINUS = (1 << 30) | (int)Scancode.KP_PLUSMINUS,
        KP_CLEAR = (1 << 30) | (int)Scancode.KP_CLEAR,
        KP_CLEARENTRY = (1 << 30) | (int)Scancode.KP_CLEARENTRY,
        KP_BINARY = (1 << 30) | (int)Scancode.KP_BINARY,
        KP_OCTAL = (1 << 30) | (int)Scancode.KP_OCTAL,
        KP_DECIMAL = (1 << 30) | (int)Scancode.KP_DECIMAL,
        KP_HEXADECIMAL = (1 << 30) | (int)Scancode.KP_HEXADECIMAL,
        LCTRL = (1 << 30) | (int)Scancode.LCTRL,
        LSHIFT = (1 << 30) | (int)Scancode.LSHIFT,
        LALT = (1 << 30) | (int)Scancode.LALT,
        LGUI = (1 << 30) | (int)Scancode.LGUI,
        RCTRL = (1 << 30) | (int)Scancode.RCTRL,
        RSHIFT = (1 << 30) | (int)Scancode.RSHIFT,
        RALT = (1 << 30) | (int)Scancode.RALT,
        RGUI = (1 << 30) | (int)Scancode.RGUI,
        MODE = (1 << 30) | (int)Scancode.MODE,
        AUDIONEXT = (1 << 30) | (int)Scancode.AUDIONEXT,
        AUDIOPREV = (1 << 30) | (int)Scancode.AUDIOPREV,
        AUDIOSTOP = (1 << 30) | (int)Scancode.AUDIOSTOP,
        AUDIOPLAY = (1 << 30) | (int)Scancode.AUDIOPLAY,
        AUDIOMUTE = (1 << 30) | (int)Scancode.AUDIOMUTE,
        MEDIASELECT = (1 << 30) | (int)Scancode.MEDIASELECT,
        WWW = (1 << 30) | (int)Scancode.WWW,
        MAIL = (1 << 30) | (int)Scancode.MAIL,
        CALCULATOR = (1 << 30) | (int)Scancode.CALCULATOR,
        COMPUTER = (1 << 30) | (int)Scancode.COMPUTER,
        AC_SEARCH = (1 << 30) | (int)Scancode.AC_SEARCH,
        AC_HOME = (1 << 30) | (int)Scancode.AC_HOME,
        AC_BACK = (1 << 30) | (int)Scancode.AC_BACK,
        AC_FORWARD = (1 << 30) | (int)Scancode.AC_FORWARD,
        AC_STOP = (1 << 30) | (int)Scancode.AC_STOP,
        AC_REFRESH = (1 << 30) | (int)Scancode.AC_REFRESH,
        AC_BOOKMARKS = (1 << 30) | (int)Scancode.AC_BOOKMARKS,
        BRIGHTNESSDOWN = (1 << 30) | (int)Scancode.BRIGHTNESSDOWN,
        BRIGHTNESSUP = (1 << 30) | (int)Scancode.BRIGHTNESSUP,
        DISPLAYSWITCH = (1 << 30) | (int)Scancode.DISPLAYSWITCH,
        KBDILLUMTOGGLE = (1 << 30) | (int)Scancode.KBDILLUMTOGGLE,
        KBDILLUMDOWN = (1 << 30) | (int)Scancode.KBDILLUMDOWN,
        KBDILLUMUP = (1 << 30) | (int)Scancode.KBDILLUMUP,
        EJECT = (1 << 30) | (int)Scancode.EJECT,
        SLEEP = (1 << 30) | (int)Scancode.SLEEP
    }

    [Flags]
    internal enum Keymod : ushort
    {
        NONE = 0x0000,
        LSHIFT = 0x0001,
        RSHIFT = 0x0002,
        LCTRL = 0x0040,
        RCTRL = 0x0080,
        LALT = 0x0100,
        RALT = 0x0200,
        LGUI = 0x0400,
        RGUI = 0x0800,
        NUM = 0x1000,
        CAPS = 0x2000,
        MODE = 0x4000,
        RESERVED = 0x8000,
        CTRL = (LCTRL | RCTRL),
        SHIFT = (LSHIFT | RSHIFT),
        ALT = (LALT | RALT),
        GUI = (LGUI | RGUI)
    }

    internal enum Scancode
    {
        UNKNOWN = 0,
        A = 4,
        B = 5,
        C = 6,
        D = 7,
        E = 8,
        F = 9,
        G = 10,
        H = 11,
        I = 12,
        J = 13,
        K = 14,
        L = 15,
        M = 16,
        N = 17,
        O = 18,
        P = 19,
        Q = 20,
        R = 21,
        S = 22,
        T = 23,
        U = 24,
        V = 25,
        W = 26,
        X = 27,
        Y = 28,
        Z = 29,
        Num1 = 30,
        Num2 = 31,
        Num3 = 32,
        Num4 = 33,
        Num5 = 34,
        Num6 = 35,
        Num7 = 36,
        Num8 = 37,
        Num9 = 38,
        Num0 = 39,
        RETURN = 40,
        ESCAPE = 41,
        BACKSPACE = 42,
        TAB = 43,
        SPACE = 44,
        MINUS = 45,
        EQUALS = 46,
        LEFTBRACKET = 47,
        RIGHTBRACKET = 48,
        BACKSLASH = 49,
        NONUSHASH = 50,
        SEMICOLON = 51,
        APOSTROPHE = 52,
        GRAVE = 53,
        COMMA = 54,
        PERIOD = 55,
        SLASH = 56,
        CAPSLOCK = 57,
        F1 = 58,
        F2 = 59,
        F3 = 60,
        F4 = 61,
        F5 = 62,
        F6 = 63,
        F7 = 64,
        F8 = 65,
        F9 = 66,
        F10 = 67,
        F11 = 68,
        F12 = 69,
        PRINTSCREEN = 70,
        SCROLLLOCK = 71,
        PAUSE = 72,
        INSERT = 73,
        HOME = 74,
        PAGEUP = 75,
        DELETE = 76,
        END = 77,
        PAGEDOWN = 78,
        RIGHT = 79,
        LEFT = 80,
        DOWN = 81,
        UP = 82,
        NUMLOCKCLEAR = 83,
        KP_DIVIDE = 84,
        KP_MULTIPLY = 85,
        KP_MINUS = 86,
        KP_PLUS = 87,
        KP_ENTER = 88,
        KP_1 = 89,
        KP_2 = 90,
        KP_3 = 91,
        KP_4 = 92,
        KP_5 = 93,
        KP_6 = 94,
        KP_7 = 95,
        KP_8 = 96,
        KP_9 = 97,
        KP_0 = 98,
        KP_PERIOD = 99,
        NONUSBACKSLASH = 100,
        APPLICATION = 101,
        POWER = 102,
        KP_EQUALS = 103,
        F13 = 104,
        F14 = 105,
        F15 = 106,
        F16 = 107,
        F17 = 108,
        F18 = 109,
        F19 = 110,
        F20 = 111,
        F21 = 112,
        F22 = 113,
        F23 = 114,
        F24 = 115,
        EXECUTE = 116,
        HELP = 117,
        MENU = 118,
        SELECT = 119,
        STOP = 120,
        AGAIN = 121,
        UNDO = 122,
        CUT = 123,
        COPY = 124,
        PASTE = 125,
        FIND = 126,
        MUTE = 127,
        VOLUMEUP = 128,
        VOLUMEDOWN = 129,
        // not sure whether there's a reason to enable these
        //  LOCKINGCAPSLOCK = 130,
        //  LOCKINGNUMLOCK = 131,
        //  LOCKINGSCROLLLOCK = 132,
        KP_COMMA = 133,
        KP_EQUALSAS400 = 134,
        INTERNATIONAL1 = 135,
        INTERNATIONAL2 = 136,
        INTERNATIONAL3 = 137,
        INTERNATIONAL4 = 138,
        INTERNATIONAL5 = 139,
        INTERNATIONAL6 = 140,
        INTERNATIONAL7 = 141,
        INTERNATIONAL8 = 142,
        INTERNATIONAL9 = 143,
        LANG1 = 144,
        LANG2 = 145,
        LANG3 = 146,
        LANG4 = 147,
        LANG5 = 148,
        LANG6 = 149,
        LANG7 = 150,
        LANG8 = 151,
        LANG9 = 152,
        ALTERASE = 153,
        SYSREQ = 154,
        CANCEL = 155,
        CLEAR = 156,
        PRIOR = 157,
        RETURN2 = 158,
        SEPARATOR = 159,
        OUT = 160,
        OPER = 161,
        CLEARAGAIN = 162,
        CRSEL = 163,
        EXSEL = 164,
        KP_00 = 176,
        KP_000 = 177,
        THOUSANDSSEPARATOR = 178,
        DECIMALSEPARATOR = 179,
        CURRENCYUNIT = 180,
        CURRENCYSUBUNIT = 181,
        KP_LEFTPAREN = 182,
        KP_RIGHTPAREN = 183,
        KP_LEFTBRACE = 184,
        KP_RIGHTBRACE = 185,
        KP_TAB = 186,
        KP_BACKSPACE = 187,
        KP_A = 188,
        KP_B = 189,
        KP_C = 190,
        KP_D = 191,
        KP_E = 192,
        KP_F = 193,
        KP_XOR = 194,
        KP_POWER = 195,
        KP_PERCENT = 196,
        KP_LESS = 197,
        KP_GREATER = 198,
        KP_AMPERSAND = 199,
        KP_DBLAMPERSAND = 200,
        KP_VERTICALBAR = 201,
        KP_DBLVERTICALBAR = 202,
        KP_COLON = 203,
        KP_HASH = 204,
        KP_SPACE = 205,
        KP_AT = 206,
        KP_EXCLAM = 207,
        KP_MEMSTORE = 208,
        KP_MEMRECALL = 209,
        KP_MEMCLEAR = 210,
        KP_MEMADD = 211,
        KP_MEMSUBTRACT = 212,
        KP_MEMMULTIPLY = 213,
        KP_MEMDIVIDE = 214,
        KP_PLUSMINUS = 215,
        KP_CLEAR = 216,
        KP_CLEARENTRY = 217,
        KP_BINARY = 218,
        KP_OCTAL = 219,
        KP_DECIMAL = 220,
        KP_HEXADECIMAL = 221,
        LCTRL = 224,
        LSHIFT = 225,
        LALT = 226,
        LGUI = 227,
        RCTRL = 228,
        RSHIFT = 229,
        RALT = 230,
        RGUI = 231,
        MODE = 257,
        // These come from the USB consumer page (0x0C)
        AUDIONEXT = 258,
        AUDIOPREV = 259,
        AUDIOSTOP = 260,
        AUDIOPLAY = 261,
        AUDIOMUTE = 262,
        MEDIASELECT = 263,
        WWW = 264,
        MAIL = 265,
        CALCULATOR = 266,
        COMPUTER = 267,
        AC_SEARCH = 268,
        AC_HOME = 269,
        AC_BACK = 270,
        AC_FORWARD = 271,
        AC_STOP = 272,
        AC_REFRESH = 273,
        AC_BOOKMARKS = 274,
        // These come from other sources, and are mostly mac related
        BRIGHTNESSDOWN = 275,
        BRIGHTNESSUP = 276,
        DISPLAYSWITCH = 277,
        KBDILLUMTOGGLE = 278,
        KBDILLUMDOWN = 279,
        KBDILLUMUP = 280,
        EJECT = 281,
        SLEEP = 282,
        APP1 = 283,
        APP2 = 284,
        // This is not a key, simply marks the number of scancodes
        // so that you know how big to make your arrays.
        SDL_NUM_SCANCODES = 512
    }

    internal enum State : byte
    {
        Released = 0,
        Pressed = 1
    }

    [Flags]
    internal enum SystemFlags : uint
    {
        Default = 0,
        TIMER = 0x00000001,
        AUDIO = 0x00000010,
        VIDEO = 0x00000020,
        JOYSTICK = 0x00000200,
        HAPTIC = 0x00001000,
        GAMECONTROLLER = 0x00002000,
        NOPARACHUTE = 0x00100000,
        EVERYTHING = TIMER | AUDIO | VIDEO |
            JOYSTICK | HAPTIC | GAMECONTROLLER
    }

    internal enum SysWMType
    {
        Unknown = 0,
        Windows,
        X11,
        Wayland,
        DirectFB,
        Cocoa,
        UIKit,
    }

    internal enum WindowEventID : byte
    {
        NONE,
        SHOWN,
        HIDDEN,
        EXPOSED,
        MOVED,
        RESIZED,
        SIZE_CHANGED,
        MINIMIZED,
        MAXIMIZED,
        RESTORED,
        ENTER,
        LEAVE,
        FOCUS_GAINED,
        FOCUS_LOST,
        CLOSE,
    }

    internal enum WindowFlags
    {
        Default = 0,
        FULLSCREEN = 0x00000001,
        OPENGL = 0x00000002,
        SHOWN = 0x00000004,
        HIDDEN = 0x00000008,
        BORDERLESS = 0x00000010,
        RESIZABLE = 0x00000020,
        MINIMIZED = 0x00000040,
        MAXIMIZED = 0x00000080,
        INPUT_GRABBED = 0x00000100,
        INPUT_FOCUS = 0x00000200,
        MOUSE_FOCUS = 0x00000400,
        FULLSCREEN_DESKTOP = (FULLSCREEN | 0x00001000),
        FOREIGN = 0x00000800,
        ALLOW_HIGHDPI = 0x00002000,
    }

    internal struct ControllerAxisEvent
    {
        public EventType Type;
        public uint Timestamp;
        public int Which;
        public GameControllerAxis Axis;
        private byte padding1;
        private byte padding2;
        private byte padding3;
        public short Value;
        private ushort padding4;
    }

    internal struct ControllerButtonEvent
    {
        public EventType Type;
        public uint Timestamp;
        public int Which;
        public GameControllerButton Button;
        public State State;
        private byte padding1;
        private byte padding2;
    }

    internal struct ControllerDeviceEvent
    {
        public EventType Type;
        public uint Timestamp;

        /// <summary>
        /// The joystick device index for the ADDED event, instance id for the REMOVED or REMAPPED event
        /// </summary>
        public int Which;
    }

    internal struct DisplayMode
    {
        public uint Format;
        public int Width;
        public int Height;
        public int RefreshRate;
        public IntPtr DriverData;
    }

    [StructLayout(LayoutKind.Explicit)]
    internal struct Event
    {
        [FieldOffset(0)]
        public EventType Type;
        [FieldOffset(0)]
        public WindowEvent Window;
        [FieldOffset(0)]
        public KeyboardEvent Key;
        [FieldOffset(0)]
        public TextEditingEvent Edit;
        [FieldOffset(0)]
        public TextInputEvent Text;
        [FieldOffset(0)]
        public MouseMotionEvent Motion;
        [FieldOffset(0)]
        public MouseButtonEvent Button;
        [FieldOffset(0)]
        public MouseWheelEvent Wheel;
        [FieldOffset(0)]
        public JoyAxisEvent JoyAxis;
        [FieldOffset(0)]
        public JoyBallEvent JoyBall;
        [FieldOffset(0)]
        public JoyHatEvent JoyHat;
        [FieldOffset(0)]
        public JoyButtonEvent JoyButton;
        [FieldOffset(0)]
        public JoyDeviceEvent JoyDevice;
        [FieldOffset(0)]
        public ControllerAxisEvent ControllerAxis;
        [FieldOffset(0)]
        public ControllerButtonEvent ControllerButton;
        [FieldOffset(0)]
        public ControllerDeviceEvent ControllerDevice;
        [FieldOffset(0)]
        public DropEvent Drop;
#if false
        [FieldOffset(0)]
        public QuitEvent quit;
        [FieldOffset(0)]
        public UserEvent user;
        [FieldOffset(0)]
        public SysWMEvent syswm;
        [FieldOffset(0)]
        public TouchFingerEvent tfinger;
        [FieldOffset(0)]
        public MultiGestureEvent mgesture;
        [FieldOffset(0)]
        public DollarGestureEvent dgesture;
#endif

        // Ensure the structure is big enough
        // This hack is necessary to ensure compatibility
        // with different SDL versions, which might have
        // different sizeof(SDL_Event).
        [FieldOffset(0)]
        private unsafe fixed byte reserved[128];
    }

    [StructLayout(LayoutKind.Explicit)]
    internal struct GameControllerButtonBind
    {
        [FieldOffset(0)]
        public GameControllerBindType BindType;
        [FieldOffset(4)]
        public Button Button;
        [FieldOffset(4)]
        public GameControllerAxis Axis;
        [FieldOffset(4)]
        public int Hat;
        [FieldOffset(8)]
        public int HatMask;
    }

    internal struct JoyAxisEvent
    {
        public EventType Type;
        public UInt32 Timestamp;
        public Int32 Which; // SDL_JoystickID
        public byte Axis;
        private byte padding1;
        private byte padding2;
        private byte padding3;
        public Int16 Value;
        private UInt16 padding4;
    }

    internal struct JoyBallEvent
    {
        public EventType Type;
        public uint Timestamp;
        public int Which;
        public byte Ball;
        private byte padding1;
        private byte padding2;
        private byte padding3;
        public short Xrel;
        public short Yrel;
    }

    internal struct JoyButtonEvent
    {
        public EventType Type;
        public uint Timestamp;
        public int Which;
        public byte Button;
        public State State;
        private byte padding1;
        private byte padding2;
    }

    internal struct JoyDeviceEvent
    {
        public EventType Type;
        public uint Timestamp;
        public int Which;
    }

    internal struct JoyHatEvent
    {
        public EventType Type;
        public uint Timestamp;
        public int Which;
        public byte Hat;
        public HatPosition Value;
        private byte padding1;
        private byte padding2;
    }

    internal struct JoystickGuid
    {
        private long data0;
        private long data1;

        public Guid ToGuid()
        {
            byte[] data = new byte[16];

            unsafe
            {
                fixed (JoystickGuid* pdata = &this)
                {
                    Marshal.Copy(new IntPtr(pdata), data, 0, data.Length);
                }
            }

            // The Guid(byte[]) constructor swaps the first 4+2+2 bytes.
            // Compensate for that, otherwise we will not be able to match
            // the Guids in the configuration database.
            if (BitConverter.IsLittleEndian)
            {
                Array.Reverse(data, 0, 4);
                Array.Reverse(data, 4, 2);
                Array.Reverse(data, 6, 2);
            }

            return new Guid(data);
        }
    }

    internal struct KeyboardEvent
    {
        public EventType Type;
        public uint Timestamp;
        public uint WindowID;
        public State State;
        public byte Repeat;
        private byte padding2;
        private byte padding3;
        public Keysym Keysym;
    }

    internal struct Keysym
    {
        public Scancode Scancode;
        public Keycode Sym;
        public Keymod Mod;
        [Obsolete]
        public uint Unicode;
    }

    internal struct MouseButtonEvent
    {
        public EventType Type;
        public UInt32 Timestamp;
        public UInt32 WindowID;
        public UInt32 Which;
        public Button Button;
        public State State;
        public byte Clicks;
        private byte padding1;
        public Int32 X;
        public Int32 Y;
    }

    internal struct MouseMotionEvent
    {
        public EventType Type;
        public uint Timestamp;
        public uint WindowID;
        public uint Which;
        public ButtonFlags State;
        public Int32 X;
        public Int32 Y;
        public Int32 Xrel;
        public Int32 Yrel;
    }

    internal struct MouseWheelEvent
    {
        public EventType Type;
        public uint Timestamp;
        public uint WindowID;
        public uint Which;
        public int X;
        public int Y;

        public enum EventType : uint
        {
            /* Touch events */
            FingerDown      = 0x700,
            FingerUp,
            FingerMotion,

            /* Gesture events */
            DollarGesture   = 0x800,
            DollarRecord,
            MultiGesture,
        }

        public const uint TouchMouseID = 0xffffffff;
    }

    internal struct Rect
    {
        public int X;
        public int Y;
        public int Width;
        public int Height;
    }

    internal struct SysWMInfo
    {
        public Version Version;
        public SysWMType Subsystem;
        public SysInfo Info;

        [StructLayout(LayoutKind.Explicit)]
        public struct SysInfo
        {
            [FieldOffset(0)]
            public WindowsInfo Windows;
            [FieldOffset(0)]
            public X11Info X11;
            [FieldOffset(0)]
            public WaylandInfo Wayland;
            [FieldOffset(0)]
            public DirectFBInfo DirectFB;
            [FieldOffset(0)]
            public CocoaInfo Cocoa;
            [FieldOffset(0)]
            public UIKitInfo UIKit;

            public struct WindowsInfo
            {
                public IntPtr Window;
            }

            public struct X11Info
            {
                public IntPtr Display;
                public IntPtr Window;
            }

            public struct WaylandInfo
            {
                public IntPtr Display;
                public IntPtr Surface;
                public IntPtr ShellSurface;
            }

            public struct DirectFBInfo
            {
                public IntPtr Dfb;
                public IntPtr Window;
                public IntPtr Surface;
            }

            public struct CocoaInfo
            {
                public IntPtr Window;
            }

            public struct UIKitInfo
            {
                public IntPtr Window;
            }
        }
    }

    internal struct TextEditingEvent
    {
        public const int TextSize = 32;

        public EventType Type;
        public UInt32 Timestamp;
        public UInt32 WindowID;
        public unsafe fixed byte Text[TextSize];
        public Int32 Start;
        public Int32 Length;
    }

    internal struct TextInputEvent
    {
        public const int TextSize = 32;

        public EventType Type;
        public UInt32 Timestamp;
        public UInt32 WindowID;
        public unsafe fixed byte Text[TextSize];
    }

    internal struct Version
    {
        public byte Major;
        public byte Minor;
        public byte Patch;

        public int Number
        {
            get { return 1000 * Major + 100 * Minor + Patch; }
        }
    }

    internal struct WindowEvent
    {
        public EventType Type;
        public UInt32 Timestamp;
        public UInt32 WindowID;
        public WindowEventID Event;
        private byte padding1;
        private byte padding2;
        private byte padding3;
        public Int32 Data1;
        public Int32 Data2;
    }

    /// <summary>
    /// Drop event for SDL2 interop. For detailed info look: https://wiki.libsdl.org/SDL_DropEvent
    /// </summary>
    internal struct DropEvent
    {
        public UInt32 Type;
        public UInt32 Timestamp;
        public IntPtr File;
        public UInt32 WindowID;
    }
}

