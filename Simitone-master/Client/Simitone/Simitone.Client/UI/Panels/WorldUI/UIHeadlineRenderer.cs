﻿using FSO.Client;
using FSO.Common.Utils;
using FSO.Files.Formats.IFF;
using FSO.Files.Formats.IFF.Chunks;
using FSO.LotView;
using FSO.SimAntics;
using FSO.SimAntics.Model;
using FSO.SimAntics.Primitives;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Simitone.Client.UI.Panels.WorldUI
{
    public class UIHeadlineRenderer : VMHeadlineRenderer
    {
        private static IffFile Sprites;
        private static Texture2D WhitePx;
        private static int[] GroupOffsets =
        {
            0,
            100,
            400,
            200,
            300,
            500,
            600,
            0, //algorithmic
            700,
            800,
            900,
        };
        private static int[] ZoomToDiv =
        {
            0,
            4,
            2,
            1
        };

        private RenderTarget2D Texture;
        private SPR Sprite;
        private SPR BGSprite;
        private WorldZoom LastZoom;
        private Texture2D AlgTex;
        private int ZoomFrame;
        private bool Invalidated;

        private bool DrawSkill
        {
            get
            {
                return LastZoom == WorldZoom.Near && Headline.Operand.Group == VMSetBalloonHeadlineOperandGroup.Progress && Headline.Index < 10;
            }
        }

        public UIHeadlineRenderer(VMRuntimeHeadline headline) : base(headline)
        {
            if (Sprites == null)
            {
                var content = FSO.Content.Content.Get();
                Sprites = new FSO.Files.Formats.IFF.IffFile(
                    content.TS1? 
                        Path.Combine(content.TS1BasePath, "GameData/Sprites.iff") : 
                        content.GetPath("objectdata/globals/sprites.iff")
                    );
            }

            if (Headline.Operand.Group != VMSetBalloonHeadlineOperandGroup.Algorithmic)
                Sprite = Sprites.Get<SPR>((ushort)(GroupOffsets[(int)Headline.Operand.Group] + Headline.Index));

            if (Headline.Operand.Type != 255 && Headline.Operand.Type != 3)
                BGSprite = Sprites.Get<SPR>((ushort)(GroupOffsets[(int)VMSetBalloonHeadlineOperandGroup.Balloon]+Headline.Operand.Type));

            LastZoom = WorldZoom.Near;
        }

        public void RecalculateTarget()
        {
            ZoomFrame = 3 - (int)LastZoom;

            if (Texture != null)
            {
                Texture.Dispose();
                Texture = null;
            }

            if (DrawSkill)
            {
                Texture = new RenderTarget2D(GameFacade.GraphicsDevice, 160, 49);
                return;
            }

            if (Sprite != null)
            {
                var bigFrame = (BGSprite != null) ? BGSprite.Frames[ZoomFrame].GetTexture(GameFacade.GraphicsDevice) : Sprite.Frames[ZoomFrame].GetTexture(GameFacade.GraphicsDevice);
                if (bigFrame.Width == 0) return;
                Texture = new RenderTarget2D(GameFacade.GraphicsDevice, Math.Max(1,bigFrame.Width), Math.Max(1,bigFrame.Height));
            }
            else if (Headline.Operand.Group == VMSetBalloonHeadlineOperandGroup.Algorithmic && LastZoom != WorldZoom.Far)
            {
                AlgTex = (Headline.IconTarget == null)?WhitePx:Headline.IconTarget.GetIcon(GameFacade.GraphicsDevice, (int)LastZoom - 1);
                var bigFrame = (BGSprite != null) ? BGSprite.Frames[ZoomFrame].GetTexture(GameFacade.GraphicsDevice) : AlgTex;
                if (bigFrame.Width == 0) return;
                Texture = new RenderTarget2D(GameFacade.GraphicsDevice, bigFrame.Width, bigFrame.Height);
            }
            else AlgTex = null;
            Invalidated = true;
        }

        public string SkillString;
        public string SpeedString;

        public int SkillValue = -1;
        public int SpeedValue = -1;

        public void ProcessSkill()
        {
            var avatar = (VMAvatar)Headline.Target;
            var eff = avatar.GetPersonData(VMPersonDataVariable.SkillEfficiency);
            var e1 = eff >> 8;
            if (e1 < 0 || e1 > 100) return; //invalid skill
            var skillValue = avatar.GetPersonData((VMPersonDataVariable)(e1));
            var speedValue = (eff & 0xFF);
            
            if (skillValue != SkillValue || SpeedValue != speedValue)
            {
                Invalidated = true;
                SkillValue = skillValue;
                SpeedValue = speedValue;
                SkillString = "Skill: " + (SkillValue / 100.0).ToString("F2");
                SpeedString = "Speed: " + SpeedValue + "%";
            }
        }

        public override Texture2D DrawFrame(World world)
        {
            if (LastZoom != world.State.Zoom || Texture == null)
            {
                if (WhitePx == null) WhitePx = TextureGenerator.GetPxWhite(GameFacade.GraphicsDevice);
                Invalidated = true;
                LastZoom = world.State.Zoom;
                RecalculateTarget();
                if (Texture == null) return null;
            }
            var GD = GameFacade.GraphicsDevice;
            var batch = GameFacade.Screens.SpriteBatch;

            if (DrawSkill) ProcessSkill();
            else if (Headline.Anim % 15 == 0 && Sprite != null && Sprite.Frames.Count > 3) Invalidated = true;

            if (Invalidated) //todo: logic for drawing skills less often
            {
                GD.SetRenderTarget(Texture);
                GD.Clear(Color.Transparent);
                batch.Begin();

                if (BGSprite != null) batch.Draw(BGSprite.Frames[ZoomFrame].GetTexture(GD), new Vector2(), Color.White);

                Texture2D main = null;
                Vector2 offset = new Vector2();
                if (Sprite != null)
                {
                    var animFrame = (Headline.Anim / 15) % (Sprite.Frames.Count / 3);
                    main = Sprite.Frames[ZoomFrame + animFrame * 3].GetTexture(GD);
                    offset = new Vector2(0, 4);
                }
                else if (AlgTex != null)
                {
                    main = AlgTex;
                    offset = new Vector2(0, -6);
                }
                offset /= ZoomToDiv[(int)LastZoom];

                if (main != null && Texture != null) batch.Draw(main, new Vector2(Texture.Width / 2 - main.Width / 2, Texture.Height / 2 - main.Height / 2) + offset, Color.White);

                if (Headline.Operand.Crossed)
                {
                    Texture2D Cross = Sprites.Get<SPR>(0x67).Frames[ZoomFrame].GetTexture(GD);
                    batch.Draw(Cross, new Vector2(Texture.Width / 2 - Cross.Width / 2, Texture.Height / 2 - Cross.Height / 4), Color.White);
                }

                batch.End();
                GD.SetRenderTarget(null);
                Invalidated = false;
            }

            return Texture;
        }

        public override void Dispose()
        {
            if (Texture != null) Texture.Dispose();
        }
    }

    public class UIHeadlineRendererProvider : VMHeadlineRendererProvider
    {
        public VMHeadlineRenderer Get(VMRuntimeHeadline headline)
        {
            return (headline.Operand.Group == VMSetBalloonHeadlineOperandGroup.Money)? new UIMoneyHeadline(headline) : ((VMHeadlineRenderer)new UIHeadlineRenderer(headline));
        }
    }
}
