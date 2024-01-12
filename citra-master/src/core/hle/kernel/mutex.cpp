// Copyright 2014 Citra Emulator Project
// Licensed under GPLv2 or any later version
// Refer to the license.txt file included.

#include <map>
#include <vector>

#include <boost/range/algorithm_ext/erase.hpp>

#include "common/common.h"

#include "core/hle/kernel/kernel.h"
#include "core/hle/kernel/mutex.h"
#include "core/hle/kernel/thread.h"

namespace Kernel {

/**
 * Resumes a thread waiting for the specified mutex
 * @param mutex The mutex that some thread is waiting on
 */
static void ResumeWaitingThread(Mutex* mutex) {
    // Reset mutex lock thread handle, nothing is waiting
    mutex->lock_count = 0;
    mutex->holding_thread = nullptr;

    // Find the next waiting thread for the mutex...
    auto next_thread = mutex->WakeupNextThread();
    if (next_thread != nullptr) {
        mutex->Acquire(next_thread);
    }
}

void ReleaseThreadMutexes(Thread* thread) {
    for (auto& mtx : thread->held_mutexes) {
        ResumeWaitingThread(mtx.get());
    }
    thread->held_mutexes.clear();
}

Mutex::Mutex() {}
Mutex::~Mutex() {}

SharedPtr<Mutex> Mutex::Create(bool initial_locked, std::string name) {
    SharedPtr<Mutex> mutex(new Mutex);

    mutex->lock_count = 0;
    mutex->name = std::move(name);
    mutex->holding_thread = nullptr;

    // Acquire mutex with current thread if initialized as locked...
    if (initial_locked)
        mutex->Acquire();

    return mutex;
}

bool Mutex::ShouldWait() {
    return lock_count > 0 && holding_thread != GetCurrentThread();;
}

void Mutex::Acquire() {
    Acquire(GetCurrentThread());
}

void Mutex::Acquire(SharedPtr<Thread> thread) {
    ASSERT_MSG(!ShouldWait(), "object unavailable!");

    // Actually "acquire" the mutex only if we don't already have it...
    if (lock_count == 0) {
        thread->held_mutexes.insert(this);
        holding_thread = std::move(thread);
    }

    lock_count++;
}

void Mutex::Release() {
    // Only release if the mutex is held...
    if (lock_count > 0) {
        lock_count--;

        // Yield to the next thread only if we've fully released the mutex...
        if (lock_count == 0) {
            holding_thread->held_mutexes.erase(this);
            ResumeWaitingThread(this);
        }
    }
}

} // namespace
