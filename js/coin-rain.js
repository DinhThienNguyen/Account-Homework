// Our original 4 frames of the coin pixel art. It's base36 encoded and saved as a string using:
        // f1.map( x => ( parseInt(x).toString(36) ) ).join('-') 
        var f1 = [
            '111166661111',
            '116622226611',
            '162244444561',
            '162432234561',
            '624323463456',
            '624323463456',
            '624323463456',
            '624323463456',
            '624323463456',
            '624323463456',
            '624324463456',
            '624324463456',
            '164336634561',
            '164444445561',
            '116655556611',
            '111166661111'
        ];

        var f2 = [
            '111116611111',
            '111162261111',
            '111624456111',
            '111623356111',
            '116242645611',
            '116242645611',
            '116242645611',
            '116242645611',
            '116242645611',
            '116242645611',
            '116242645611',
            '116242645611',
            '111643356111',
            '111644456111',
            '111165561111',
            '111116611111'
        ];

        var f3 = [
            '111116611111',
            '111162261111',
            '111164461111',
            '111163361111',
            '111633456111',
            '111623456111',
            '111623456111',
            '111623456111',
            '111623456111',
            '111623456111',
            '111623456111',
            '111623456111',
            '111163361111',
            '111164461111',
            '111165561111',
            '111116611111'
        ];

        var f4 = [
            '111116611111',
            '111162261111',
            '111623246111',
            '111622346111',
            '116223234611',
            '116232324611',
            '116223234611',
            '116232324611',
            '116223234611',
            '116232324611',
            '116223234611',
            '116232324611',
            '111623246111',
            '111632346111',
            '111164461111',
            '111116611111'
        ];

        var coinWidth = 12, // Cols in our pixel art.
            coinHeight = 16, // Rows in our pixel art.
            coinScale = 4, // Upscale our pixels so we're not squinting at 12x16 pixel coins.
            t = 0,
            R = Math.random,
            frames = [
                '1f2hrcon-1hkpv1yr-22j85imp-22mbyibl-7yt62jhc-7yt62jhc-7yt62jhc-7yt62jhc-7yt62jhc-7yt62jhc-7yt6nz34-7yt6nz34-23htserl-23jlz69l-1hl9pfk3-1f2hrcon',
                '1f1nyluv-1f2f51mf-1fa2bhkf-1fa1nwsv-1hefvbe3-1hefvbe3-1hefvbe3-1hefvbe3-1hefvbe3-1hefvbe3-1hefvbe3-1hefvbe3-1fadkkwf-1fae85nz-1f2h3rx3-1f1nyluv',
                '1f1nyluv-1f2f51mf-1f2gg75j-1f2fsmdz-1fa7oe0f-1fa1q1yn-1fa1q1yn-1fa1q1yn-1fa1q1yn-1fa1q1yn-1fa1q1yn-1fa1q1yn-1f2fsmdz-1f2gg75j-1f2h3rx3-1f1nyluv',
                '1f1nyluv-1f2f51mf-1fa1ljxb-1fa129hb-1he4b9rn-1he9q3nn-1he4b9rn-1he9q3nn-1he4b9rn-1he9q3nn-1he4b9rn-1he9q3nn-1fa1ljxb-1fa70lj3-1f2gg75j-1f1nyluv'
            ], // Our 4 coin frames, base36 encoded. The biggest chunk of our code by far.
            colors = ['', '', '#fff', '#f8f800', '#f8d820', '#d8a038', '#000'], // The colors to paint the pixels.
            coins = [],
            Coin = function () {
                this.i()
            };
        Coin.prototype = {
            // Init the coin. Centered on the x axis, offscreen above the canvas, with a random x/y velocity, rotation speed, and initial frame.
            i: function () {
                this.x = winnerEffectCanvas.width / 2;
                this.y = -coinHeight * coinScale - (R() * 99);
                this.vX = (R() - 0.5) * 9;
                this.vX += this.vX > 0 ? 1 : -1;
                this.vY = (R() - 0.5) * 5;
                this.rotationSpeed = ~~(R() * 12) + 2;
                this.frame = ~~(R() * 4);
            },
            // Update the coin. Apply gravity and update position and frame. If we're off the edge on the x-axis, reinit. If we're past the bottom of the screen, bounce.
            u: function () {
                this.vY++;
                this.x += this.vX;
                this.y += this.vY;
                if (t % this.rotationSpeed == 0) this.frame++, this.frame = this.frame % 4;

                var right = this.x + coinWidth * coinScale,
                    bottom = this.y + coinHeight * coinScale;
                if (this.x < -coinWidth * coinScale || this.x > winnerEffectCanvas.width) this.i();
                if (bottom > winnerEffectCanvas.height) this.y -= (bottom % winnerEffectCanvas.height), this
                    .vY *= -.9;
            },
            // Draw the coin. 
            d: function () {
                var frame = frames[this.frame].split('-').map(x => (parseInt(x, 36)))
                for (var i = 0; i < frame.length; i++) {
                    var coinPixels = frame[i].toString().split('');
                    for (var p = 0; p < coinPixels.length; p++) {
                        if (coinPixels[p] > 1) {
                            ctx.fillStyle = colors[coinPixels[p]];
                            ctx.fillRect(this.x + p * coinScale, this.y + i * coinScale, coinScale, coinScale);
                        }
                    }
                }
            }
        }

        function updateCoinRain() {
            let requestId = 0;
            ctx.clearRect(0, 0, winnerEffectCanvasWidth, winnerEffectCanvasHeight);
            // Produce a new coin every half second until we get 40 coins. After that, they'll reset themselves for an infinite supply.
            if (t % 10 == 0 && coins.length < 40) {
                coins.push(new Coin());
            }
            for (var i = 0; i < coins.length; i++) {
                coins[i].u();
                coins[i].d();
            }
            t++;
            if (continueCoinRain) {
                requestId = window.requestAnimationFrame(updateCoinRain);
            } else {
                ctx.clearRect(0, 0, winnerEffectCanvasWidth, winnerEffectCanvasHeight);
                window.cancelAnimationFrame(requestId);
                coins = [];
            }
        }