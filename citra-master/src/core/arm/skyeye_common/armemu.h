/*  armemu.h -- ARMulator emulation macros:  ARM6 Instruction Emulator.
    Copyright (C) 1994 Advanced RISC Machines Ltd.
 
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.
 
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA. */

#pragma once

#include "core/arm/skyeye_common/armdefs.h"

// Flags for use with the APSR.
enum : u32 {
    NBIT = (1U << 31U),
    ZBIT = (1 << 30),
    CBIT = (1 << 29),
    VBIT = (1 << 28),
    QBIT = (1 << 27),
    JBIT = (1 << 24),
    EBIT = (1 << 9),
    ABIT = (1 << 8),
    IBIT = (1 << 7),
    FBIT = (1 << 6),
    TBIT = (1 << 5),

    // Masks for groups of bits in the APSR.
    MODEBITS = 0x1F,
    INTBITS  = 0x1C0,
};

// Different ways to start the next instruction.
enum {
    SEQ           = 0,
    NONSEQ        = 1,
    PCINCEDSEQ    = 2,
    PCINCEDNONSEQ = 3,
    PRIMEPIPE     = 4,
    RESUME        = 8
};

// Values for Emulate.
enum {
    STOP       = 0, // Stop
    CHANGEMODE = 1, // Change mode
    ONCE       = 2, // Execute just one interation
    RUN        = 3  // Continuous execution
};

#define FLUSHPIPE state->NextInstr |= PRIMEPIPE

// Coprocessor support functions.
extern void ARMul_CoProInit(ARMul_State*);
extern void ARMul_CoProExit(ARMul_State*);
extern void ARMul_CoProAttach(ARMul_State*, unsigned, ARMul_CPInits*,
                              ARMul_CPExits*, ARMul_LDCs*, ARMul_STCs*,
                              ARMul_MRCs*, ARMul_MCRs*, ARMul_MRRCs*, ARMul_MCRRs*,
                              ARMul_CDPs*, ARMul_CPReads*, ARMul_CPWrites*);
extern void ARMul_CoProDetach(ARMul_State*, unsigned);
