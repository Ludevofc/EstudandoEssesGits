// Copyright 2015 Citra Emulator Project
// Licensed under GPLv2 or any later version
// Refer to the license.txt file included.

#pragma once

#include <array>
#include "core/hle/result.h"
#include "core/hle/service/service.h"

namespace Service {
namespace APT {

/// Signals used by APT functions
enum class SignalType : u32 {
    None            = 0x0,
    AppJustStarted  = 0x1,
    ReturningToApp  = 0xB,
    ExitingApp      = 0xC,
};

/// App Id's used by APT functions
enum class AppID : u32 {
    HomeMenu           = 0x101,
    AlternateMenu      = 0x103,
    Camera             = 0x110,
    FriendsList        = 0x112,
    GameNotes          = 0x113,
    InternetBrowser    = 0x114,
    InstructionManual  = 0x115,
    Notifications      = 0x116,
    Miiverse           = 0x117,
    SoftwareKeyboard1  = 0x201,
    Ed                 = 0x202,
    PnoteApp           = 0x204,
    SnoteApp           = 0x205,
    Error              = 0x206,
    Mint               = 0x207,
    Extrapad           = 0x208,
    Memolib            = 0x209,
    Application        = 0x300,
    SoftwareKeyboard2  = 0x401,
};

/**
 * APT::Initialize service function
 * Service function that initializes the APT process for the running application
 *  Outputs:
 *      1 : Result of the function, 0 on success, otherwise error code
 *      3 : Handle to the notification event
 *      4 : Handle to the pause event
 */
void Initialize(Service::Interface* self);

/**
 * APT::GetSharedFont service function
 *  Outputs:
 *      1 : Result of function, 0 on success, otherwise error code
 *      2 : Virtual address of where shared font will be loaded in memory
 *      4 : Handle to shared font memory
 */
void GetSharedFont(Service::Interface* self);
 
/**
 * APT::NotifyToWait service function
 *  Inputs:
 *      1 : AppID
 *  Outputs:
 *      1 : Result of function, 0 on success, otherwise error code
 */
void NotifyToWait(Service::Interface* self);

void GetLockHandle(Service::Interface* self);

void Enable(Service::Interface* self);

/**
 * APT::GetAppletManInfo service function.
 *  Inputs:
 *      1 : Unknown
 *  Outputs:
 *      1 : Result of function, 0 on success, otherwise error code
 *      2 : Unknown u32 value
 *      3 : Unknown u8 value
 *      4 : Home Menu AppId
 *      5 : AppID of currently active app
 */
void GetAppletManInfo(Service::Interface* self); 

/**
 * APT::IsRegistered service function. This returns whether the specified AppID is registered with NS yet.
 * An AppID is "registered" once the process associated with the AppID uses APT:Enable. Home Menu uses this
 * command to determine when the launched process is running and to determine when to stop using GSP etc,
 * while displaying the "Nintendo 3DS" loading screen.
 *  Inputs:
 *      1 : AppID
 *  Outputs:
 *      0 : Return header
 *      1 : Result of function, 0 on success, otherwise error code
 *      2 : Output, 0 = not registered, 1 = registered. 
 */
void IsRegistered(Service::Interface* self);

void InquireNotification(Service::Interface* self);

/**
 * APT::SendParameter service function. This sets the parameter data state. 
 * Inputs:
 *     1 : Source AppID
 *     2 : Destination AppID
 *     3 : Signal type
 *     4 : Parameter buffer size, max size is 0x1000 (this can be zero)
 *     5 : Value
 *     6 : Handle to the destination process, likely used for shared memory (this can be zero)
 *     7 : (Size<<14) | 2
 *     8 : Input parameter buffer ptr
 * Outputs:
 *     0 : Return Header
 *     1 : Result of function, 0 on success, otherwise error code
*/
void SendParameter(Service::Interface* self);

/**
 * APT::ReceiveParameter service function. This returns the current parameter data from NS state,
 * from the source process which set the parameters. Once finished, NS will clear a flag in the NS
 * state so that this command will return an error if this command is used again if parameters were
 * not set again. This is called when the second Initialize event is triggered. It returns a signal
 * type indicating why it was triggered.
 *  Inputs:
 *      1 : AppID
 *      2 : Parameter buffer size, max size is 0x1000
 *  Outputs:
 *      1 : Result of function, 0 on success, otherwise error code
 *      2 : AppID of the process which sent these parameters
 *      3 : Signal type
 *      4 : Actual parameter buffer size, this is <= to the the input size
 *      5 : Value
 *      6 : Handle from the source process which set the parameters, likely used for shared memory
 *      7 : Size
 *      8 : Output parameter buffer ptr
 */
void ReceiveParameter(Service::Interface* self);

/**
 * APT::GlanceParameter service function. This is exactly the same as APT_U::ReceiveParameter
 * (except for the word value prior to the output handle), except this will not clear the flag
 * (except when responseword[3]==8 || responseword[3]==9) in NS state.
 *  Inputs:
 *      1 : AppID
 *      2 : Parameter buffer size, max size is 0x1000
 *  Outputs:
 *      1 : Result of function, 0 on success, otherwise error code
 *      2 : Unknown, for now assume AppID of the process which sent these parameters
 *      3 : Unknown, for now assume Signal type
 *      4 : Actual parameter buffer size, this is <= to the the input size
 *      5 : Value
 *      6 : Handle from the source process which set the parameters, likely used for shared memory
 *      7 : Size
 *      8 : Output parameter buffer ptr
 */
void GlanceParameter(Service::Interface* self);

/**
 * APT::CancelParameter service function. When the parameter data is available, and when the above
 * specified fields match the ones in NS state(for the ones where the checks are enabled), this
 * clears the flag which indicates that parameter data is available
 * (same flag cleared by APT:ReceiveParameter).
 *  Inputs:
 *      1 : Flag, when non-zero NS will compare the word after this one with a field in the NS state.
 *      2 : Unknown, this is the same as the first unknown field returned by APT:ReceiveParameter.
 *      3 : Flag, when non-zero NS will compare the word after this one with a field in the NS state.
 *      4 : AppID
 *  Outputs:
 *      0 : Return header
 *      1 : Result of function, 0 on success, otherwise error code
 *      2 : Status flag, 0 = failure due to no parameter data being available, or the above enabled
 *          fields don't match the fields in NS state. 1 = success.
 */
void CancelParameter(Service::Interface* self);

/**
 * APT::AppletUtility service function
 *  Inputs:
 *      1 : Unknown, but clearly used for something
 *      2 : Buffer 1 size (purpose is unknown)
 *      3 : Buffer 2 size (purpose is unknown)
 *      5 : Buffer 1 address (purpose is unknown)
 *      65 : Buffer 2 address (purpose is unknown)
 *  Outputs:
 *      1 : Result of function, 0 on success, otherwise error code
 */
void AppletUtility(Service::Interface* self);

/**
 * APT::SetAppCpuTimeLimit service function
 *  Inputs:
 *      1 : Value, must be one
 *      2 : Percentage of CPU time from 5 to 80
 *  Outputs:
 *      1 : Result of function, 0 on success, otherwise error code
 */
void SetAppCpuTimeLimit(Service::Interface* self);

/**
 * APT::GetAppCpuTimeLimit service function
 *  Inputs:
 *      1 : Value, must be one
 *  Outputs:
 *      0 : Return header
 *      1 : Result of function, 0 on success, otherwise error code
 *      2 : System core CPU time percentage
 */
void GetAppCpuTimeLimit(Service::Interface* self);

/// Initialize the APT service
void APTInit();

/// Shutdown the APT service
void APTShutdown();

} // namespace APT
} // namespace Service
