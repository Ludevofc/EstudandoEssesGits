 @ e c h o   o f f  
 c l s  
  
 . p a k e t \ p a k e t . b o o t s t r a p p e r . e x e  
 i f   e r r o r l e v e l   1   (  
     e x i t   / b   % e r r o r l e v e l %  
 )  
  
 . p a k e t \ p a k e t . e x e   r e s t o r e  
 i f   e r r o r l e v e l   1   (  
     e x i t   / b   % e r r o r l e v e l %  
 )  
  
 I F   N O T   E X I S T   b u i l d . f s x   (  
     . p a k e t \ p a k e t . e x e   u p d a t e  
     p a c k a g e s \ F A K E \ t o o l s \ F A K E . e x e   i n i t . f s x  
 )  
  
 S E T   B u i l d T a r g e t =  
 i f   " % B u i l d R u n n e r % "   = =   " M y G e t "   (  
     S E T   B u i l d T a r g e t = N u G e t  
  
     : :   R e p l a c e   t h e   e x i s t i n g   r e l e a s e   n o t e s   f i l e   w i t h   o n e   f o r   t h i s   b u i l d   o n l y  
     e c h o   # # #   % P a c k a g e V e r s i o n %   >   R E L E A S E _ N O T E S . m d  
     e c h o   	 *   g i t   b u i l d   > >   R E L E A S E _ N O T E S . m d  
 )  
  
 p a c k a g e s \ F A K E \ t o o l s \ F A K E . e x e   b u i l d . f s x   % *   % B u i l d T a r g e t %