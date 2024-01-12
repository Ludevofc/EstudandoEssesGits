﻿/*
This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at
http://mozilla.org/MPL/2.0/.
*/

using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using FSO.Client.UI.Framework;
using FSO.Client.UI.Model;
using FSO.Common.Rendering.Framework.Model;
using FSO.SimAntics.Engine;
using FSO.SimAntics;
using FSO.HIT;
using FSO.SimAntics.NetPlay.Model.Commands;
using FSO.Common;
using Simitone.Client.UI.Controls;
using FSO.Client;
using Simitone.Client.UI.Model;
using FSO.SimAntics.Model;

namespace Simitone.Client.UI.Panels
{
    /// <summary>
    /// The queue display for ingame. Includes queue animations and control.
    /// </summary>
    public class UIInteractionQueue : UIContainer
    {

        private List<UIIQTrackEntry> QueueItems;
        public VMEntity QueueOwner;
        public VM vm;
        public Vector2 PieMenuClickPos = new Vector2(-1, -1);

        public UIInteractionQueue(VMEntity QueueOwner, VM vm)
        {
            this.vm = vm;
            this.QueueOwner = QueueOwner;
            QueueItems = new List<UIIQTrackEntry>();
        }

        public short GetElemPriority(VMQueuedAction elem, int i)
        {
            return (elem == QueueOwner.Thread.ActiveAction) ?
                        (QueueOwner as VMAvatar)?.GetPersonData(VMPersonDataVariable.Priority) ?? elem.Priority
                        : elem.Priority;
        }

        public override void Update(UpdateState state)
        {
            base.Update(state);
            if (QueueOwner == null) return;
            //detect any changes in the interaction queue.

            var queue = QueueOwner.Thread.Queue;
            bool skipParentIdle;
            for (int i = 0; i < QueueItems.Count; i++)
            {
                int position = 0;
                var itemui = QueueItems[i];
                bool found = false; //is this interaction still in the queue? if not then ditch it.
                skipParentIdle = false;
                for (int j = 0; j < queue.Count; j++)
                {
                    var elem = queue[j];
                    if (elem == itemui.Interaction)
                    {
                        found = true;
                        var priority = GetElemPriority(elem, j);
                        if (position != itemui.QueuePosition) itemui.TweenToPosition(position);
                        if (elem.NotifyIdle && priority <= 0 && !itemui.Cancelled)
                        {
                            itemui.Cancelled = true;
                            itemui.UI.SetCancelled();
                        }

                        if (elem.Name != itemui.Name)
                        {
                            itemui.Name = elem.Name;
                            itemui.UI.Tooltip = itemui.Name;
                        }
                        if (j == 0 && !itemui.Active)
                        {
                            itemui.Active = true;
                            itemui.UI.SetActive(true);
                        }
                        if (j != 0 && itemui.Active)
                        {
                            itemui.Active = false;
                            itemui.UI.SetActive(false);
                        }

                        if (itemui.IconOwner != elem.IconOwner)
                        {
                            itemui.IconOwner = elem.IconOwner;
                            itemui.UpdateInteractionIcon();
                        }

                        if (itemui.InteractionResult != elem.InteractionResult)
                        {
                            itemui.InteractionResult = elem.InteractionResult;
                            itemui.UpdateInteractionResult();
                        }
                        break;
                    }
                    if (elem.Mode != VMQueueMode.Idle && (j == 0 || elem.Mode != VMQueueMode.ParentExit) && (!skipParentIdle || elem.Mode != VMQueueMode.ParentIdle)) position++;
                    if (elem.Mode == VMQueueMode.ParentIdle) skipParentIdle = true;
                }
                if (!found)
                {
                    itemui.UI.Kill();
                    QueueItems.RemoveAt(i--); //not here anymore
                }
                else itemui.Update();
            }

            //now detect if there are any interactions we're not displaying and add them.

            skipParentIdle = false;
            for (int i = 0; i < queue.Count; i++)
            {
                int position = 0;
                var elem = queue[i];

                if (elem.Mode != VMQueueMode.Idle && (i == 0 || elem.Mode != VMQueueMode.ParentExit) && (!skipParentIdle || elem.Mode != VMQueueMode.ParentIdle))
                {
                    bool found = false; //is this interaction in the queue? if not, add it
                    for (int j = 0; j < QueueItems.Count; j++)
                    {
                        var itemui = QueueItems[j];
                        if (elem == itemui.Interaction)
                        {
                            found = true;
                            break;
                        }

                    }
                    if (!found) //new interaction!!!
                    {
                        var itemui = new UIIQTrackEntry()
                        {
                            Interaction = elem,
                            IconOwner = elem.IconOwner,
                            SourcePos = (PieMenuClickPos.X < 0) ? (new Vector2(30 + position * 50, 30)) : PieMenuClickPos,
                            TweenProgress = 0,
                            UI = new UIInteraction(i == 0),
                            Active = (i == 0)
                        };
                        itemui.UI.Position = itemui.SourcePos;
                        itemui.UI.OnMouseEvent += new FSO.Client.UI.Controls.ButtonClickDelegate(InteractionClicked);
                        itemui.UI.OnInteractionResult += InteractionResult;
                        itemui.UI.ParentEntry = itemui;
                        itemui.Name = elem.Name;
                        itemui.UI.Tooltip = itemui.Name;
                        itemui.TweenToPosition(position);
                        itemui.UpdateInteractionIcon();
                        itemui.Update();
                        this.Add(itemui.UI);
                        QueueItems.Add(itemui);

                        PieMenuClickPos = new Vector2(-1, -1);
                    }
                    position++;
                }
                if (elem.Mode == VMQueueMode.ParentIdle) skipParentIdle = true;
            }

        }

        private void InteractionResult(UIElement ui, bool accepted)
        {
            if (QueueOwner == null) return;
            UIInteraction item = (UIInteraction)ui;
            var itemui = item.ParentEntry;
            var queue = QueueOwner.Thread.Queue;
            for (int i = 0; i < queue.Count; i++)
            {
                if (queue[i] == itemui.Interaction)
                {
                    HITVM.Get().PlaySoundEvent(UISounds.CallSend);
                    var priority = GetElemPriority(itemui.Interaction, i);
                    if (!(itemui.Interaction.NotifyIdle && priority <= 0))
                    {
                        vm.SendCommand(new VMNetInteractionResultCmd
                        {
                            ActionUID = itemui.Interaction.UID,
                            ActorUID = QueueOwner.PersistID,
                            Accepted = accepted
                        });
                    }
                    break;
                }
            }
        }

        private void InteractionClicked(UIElement ui)
        {
            if (QueueOwner == null) return;
            UIInteraction item = (UIInteraction)ui;
            var itemui = item.ParentEntry;
            var queue = QueueOwner.Thread.Queue;
            for (int i = 0; i < queue.Count; i++)
            {
                if (queue[i] == itemui.Interaction)
                {
                    HITVM.Get().PlaySoundEvent(UISounds.QueueDelete);
                    var priority = GetElemPriority(itemui.Interaction, i);
                    if (!(itemui.Interaction.NotifyIdle && priority <= 0))
                    {
                        vm.SendCommand(new VMNetInteractionCancelCmd
                        {
                            ActionUID = itemui.Interaction.UID,
                            ActorUID = QueueOwner.PersistID
                        });
                    }
                    break;
                }
            }
        }
    }

    public class UIIQTrackEntry //this class basically keeps track of states to determine if things have changed.
    {
        public VMQueuedAction Interaction;
        public UIInteraction UI;
        public VMEntity IconOwner;
        public int QueuePosition;
        public bool Active;
        public bool Cancelled;
        public string Name;

        public sbyte InteractionResult = -1;

        public double TweenProgress;
        public Vector2 TargetPos;
        public Vector2 SourcePos;
        public double MotionPerFrame = 1.0 / 25.0; //default to finishing in 25 frames

        public void TweenToPosition(int pos)
        {
            Vector2 realPos;
            if (pos == 0) realPos = new Vector2(73, 73);
            else realPos = new Vector2(37 + 68 + pos*60, 41.5f);

            GameFacade.Screens.Tween.To(UI, 0.5f, new Dictionary<string, float>() { { "X", realPos.X }, { "Y", realPos.Y } }, TweenQuad.EaseOut);
            QueuePosition = pos;
            /*
            SourcePos = GetTweenPosition();
            TargetPos = new Vector2(30 + pos * 50, 30);
            TweenProgress = 0;*/
        }

        private Vector2 GetTweenPosition()
        {
            return TargetPos * (float)TweenProgress + SourcePos * (1 - (float)TweenProgress);
        }

        public void Update()
        {
            if (TweenProgress < 1)
            {
                TweenProgress = Math.Min(TweenProgress + MotionPerFrame * (60.0 / FSOEnvironment.RefreshRate), 1);
                UI.Position = GetTweenPosition();
            }
        }

        public void UpdateInteractionIcon()
        {
            UI.Icon = UIIconCache.GetObject(IconOwner);
        }

        public void UpdateInteractionResult()
        {
            UI.UpdateInteractionResult(InteractionResult);
        }
    }
}
