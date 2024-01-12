 # ! / u s r / b i n / e n v   b a s h  
  
 s e t   - e u  
 s e t   - o   p i p e f a i l  
  
 c d   ` d i r n a m e   $ 0 `  
  
 F S I A R G S = " "  
 O S = $ { O S : - " u n k n o w n " }  
 i f   [ [   " $ O S "   ! =   " W i n d o w s _ N T "   ] ]  
 t h e n  
     F S I A R G S = " - - f s i a r g s   - d : M O N O "  
 f i  
  
 f u n c t i o n   r u n ( )   {  
     i f   [ [   " $ O S "   ! =   " W i n d o w s _ N T "   ] ]  
     t h e n  
         m o n o   " $ @ "  
     e l s e  
         " $ @ "  
     f i  
 }  
  
 r u n   . p a k e t / p a k e t . b o o t s t r a p p e r . e x e  
  
 i f   [ [   " $ O S "   ! =   " W i n d o w s _ N T "   ] ]   & &  
               [   !   - e   ~ / . c o n f i g / . m o n o / c e r t s   ]  
 t h e n  
     m o z r o o t s   - - i m p o r t   - - s y n c   - - q u i e t  
 f i  
  
 r u n   . p a k e t / p a k e t . e x e   r e s t o r e  
  
 [   !   - e   b u i l d . f s x   ]   & &   r u n   . p a k e t / p a k e t . e x e   u p d a t e  
 [   !   - e   b u i l d . f s x   ]   & &   r u n   p a c k a g e s / F A K E / t o o l s / F A K E . e x e   i n i t . f s x  
 r u n   p a c k a g e s / F A K E / t o o l s / F A K E . e x e   " $ @ "   $ F S I A R G S   b u i l d . f s x