        const ALL_CLASSES = ['star-container', 'star-purple', 'star-dark', 'zoom-box', 'heal-container', 'coin-container', 'spill-container', 'glowing-card', 'glow-purple', 'glow-dark', 'glow-red', 'glow-green', 'glow-gold', 'glow-potion', 'glow-yellow','animate'];

     function resetcard3d(animationBox) {
            // Remove todas as classes de animação
            animationBox.classList.remove(...ALL_CLASSES);
            // Remove todas as partículas geradas, preservando o conteúdo original
            animationBox.querySelectorAll('.star, .heal-particle, .coin, .potion-pulse, .potion-svg-container, .potion-stream').forEach(el => el.remove());
        }

        function triggerAnimation(element, animationClass) {
            element.classList.remove(animationClass);
            void element.offsetWidth; 
            element.classList.add(animationClass);
        }
              

         function createHealParticles(numberOfParticles, animationBox) {
            for (let i = 0; i < numberOfParticles; i++) {
                const particle = document.createElement('span');
                particle.className = 'heal-particle';
                const angle = Math.random() * 360;
                const radius = Math.random() * 150 + 50; // Raio da explosão
                const endX = Math.cos(angle * (Math.PI / 180)) * radius;
                const endY = Math.sin(angle * (Math.PI / 180)) * radius; // Faz ir para todas as direções
                particle.style.setProperty('--heal-end-transform', `translate(${endX}px, ${endY}px) scale(1)`);
                animationBox.appendChild(particle);
            }
        }

        function createCoins(numberOfCoins) {
            for (let i = 0; i < numberOfCoins; i++) {
                const coin = document.createElement('span');
                coin.className = 'coin';
                const size = Math.random() * 15 + 20;
                const duration = Math.random() * 0.8 + 1.2;
                const delay = Math.random() * 1.5;
                coin.style.width = `${size}px`;
                coin.style.height = `${size}px`;
                coin.style.left = `${Math.random() * 85 + 5}%`;
                coin.style.animationDuration = `${duration}s`;
                coin.style.animationDelay = `${delay}s`;
                animationBox.appendChild(coin);
            }
        }
