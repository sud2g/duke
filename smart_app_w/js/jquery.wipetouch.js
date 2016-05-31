
(function (A) {
	A.fn.wipetouch = function (B) {
		var C = {moveX:40, moveY:40, tapToClick:false, preventDefault:true, allowDiagonal:false, wipeLeft:false, wipeRight:false, wipeUp:false, wipeDown:false, wipeUpLeft:false, wipeDownLeft:false, wipeUpRight:false, wipeDownRight:false, wipeMove:false, wipeTopLeft:false, wipeBottomLeft:false, wipeTopRight:false, wipeBottomRight:false};
		if (B) {
			A.extend(C, B);
		}
		this.each(function () {
			
			var N;
			var I;
			var M = false;
			var K;
			var P;
			var R = false;
			var G = false;
			var L = false;
			var O = false;
			function E(T) {
				var S = L || (T.originalEvent.touches && T.originalEvent.touches.length > 0);
				if (!R && S) {
					if (C.preventDefault) {
						T.preventDefault();
					}
					if (C.allowDiagonal) {
						if (!C.wipeDownLeft) {
							C.wipeDownLeft = C.wipeBottomLeft;
						}
						if (!C.wipeDownRight) {
							C.wipeDownRight = C.wipeBottomRight;
						}
						if (!C.wipeUpLeft) {
							C.wipeUpLeft = C.wipeTopLeft;
						}
						if (!C.wipeUpRight) {
							C.wipeUpRight = C.wipeTopRight;
						}
					}
					if (L) {
						N = T.pageX;
						I = T.pageY;
						A(this).bind("mousemove", H);
						A(this).one("mouseup", J);
					} else {
						N = T.originalEvent.touches[0].pageX;
						I = T.originalEvent.touches[0].pageY;
						A(this).bind("touchmove", H);
					}
					M = new Date().getTime();
					K = N;
					P = I;
					R = true;
					G = A(T.target);
				}
			}
			function J(S) {
				if (C.preventDefault) {
					S.preventDefault();
				}
				if (L) {
					A(this).unbind("mousemove", H);
				} else {
					A(this).unbind("touchmove", H);
				}
				if (R) {
					F(S);
				} else {
					D();
				}
			}
			function H(S) {
				if (C.preventDefault) {
					S.preventDefault();
				}
				if (L && !R) {
					E(S);
				}
				if (R) {
					if (L) {
						K = S.pageX;
						P = S.pageY;
					} else {
						K = S.originalEvent.touches[0].pageX;
						P = S.originalEvent.touches[0].pageY;
					}
					if (C.wipeMove) {
						Q(C.wipeMove, {curX:K, curY:P});
					}
				}
			}
			function F(Z) {
				var T = new Date().getTime();
				var U = M - T;
				var V = K;
				var W = P;
				var a = V - N;
				var h = W - I;
				var Y = Math.abs(a);
				var d = Math.abs(h);
				if (Y < 15 && d < 15 && U < 100) {
					O = false;
					if (C.preventDefault) {
						D();
						G.trigger("click");
						return;
					}
				} else {
					if (L) {
						var b = G.data("events");
						if (b) {
							var S = b.click;
							if (S && S.length > 0) {
								A.each(S, function (e, j) {
									O = j;
									return;
								});
								G.unbind("click");
							}
						}
					}
				}
				var X = a > 0;
				var f = h > 0;
				var c = ((Y + d) * 60) / ((U) / 6 * (U));
				if (c < 1) {
					c = 1;
				}
				if (c > 5) {
					c = 5;
				}
				var g = {speed:parseInt(c), x:Y, y:d, source:G};
				if (Y >= d) {
					if (X) {
						Q(C.wipeRight, g);
					} else {
						Q(C.wipeLeft, g);
					}
				}
				else {
					if (f) {
						Q(C.wipeDown, g);
					} else {
						Q(C.wipeUp, g);
					}
				}
				D();
			}
			function D() {
				N = false;
				I = false;
				M = false;
				R = false;
				if (O) {
					window.setTimeout(function () {
						G.bind("click", O);
						O = false;
					}, 50);
				}
			}
			function Q(S, T) {
				if (S) {
					S(T);
				}
			}
			if ("ontouchstart" in document.documentElement) {
				A(this).bind("touchstart", E);
				A(this).bind("touchend", J);
			} else {
				L = true;
				A(this).bind("mousedown", E);
				A(this).bind("mouseout", J);
			}
		});
		return this;
	};
})(jQuery);

