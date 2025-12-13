(() => {
  const playerScoreEl = document.getElementById('playerScore');
  const compScoreEl = document.getElementById('compScore');
  const roundsEl = document.getElementById('rounds');
  const roundResultEl = document.getElementById('roundResult');
  const playerHand = document.getElementById('playerHand');
  const compHand = document.getElementById('compHand');
  const choices = document.querySelectorAll('.choice');
  const bestOfSelect = document.getElementById('bestOf');
  const resetBtn = document.getElementById('reset');
  const autoBtn = document.getElementById('autoPlay');
  const soundBtn = document.getElementById('soundBtn');

  let playerScore = 0, compScore = 0, rounds = 0;
  let bestOf = parseInt(bestOfSelect.value, 10);
  let autoplay = false;
  let soundOn = true;
  let autoplayInterval = null;

  const moves = ['rock','paper','scissors'];
  const emoji = { rock:'👊', paper:'✋', scissors:'✌️' };

  const sounds = {
    win: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
    lose: new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'),
    tie: new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg')
  };

  function computerChoice(){
    return moves[Math.floor(Math.random()*moves.length)];
  }

  function decide(p, c){
    if(p===c) return 'draw';
    if((p==='rock'&&c==='scissors')||(p==='paper'&&c==='rock')||(p==='scissors'&&c==='paper')) return 'win';
    return 'lose';
  }

  function updateUI(){
    playerScoreEl.textContent = playerScore;
    compScoreEl.textContent = compScore;
    roundsEl.textContent = rounds;
  }

  function playRound(playerMove){
    if(isGameOver()) return;
    const compMove = computerChoice();
    const result = decide(playerMove, compMove);
    rounds++;

    playerHand.querySelector('.emoji').textContent = emoji[playerMove];
    compHand.querySelector('.emoji').textContent = emoji[compMove];

    if(result === 'win'){
      playerScore++;
      roundResultEl.className = 'round-result win';
      roundResultEl.textContent = `You win! ${playerMove} beats ${compMove}`;
      if(soundOn) sounds.win.play().catch(()=>{});
    } else if(result === 'lose'){
      compScore++;
      roundResultEl.className = 'round-result lose';
      roundResultEl.textContent = `You lose! ${compMove} beats ${playerMove}`;
      if(soundOn) sounds.lose.play().catch(()=>{});
    } else {
      roundResultEl.className = 'round-result draw';
      roundResultEl.textContent = `Draw! You both chose ${playerMove}`;
      if(soundOn) sounds.tie.play().catch(()=>{});
    }

    updateUI();
    checkGameEnd();
  }

  function isGameOver(){
    const need = Math.floor(bestOf/2)+1;
    return playerScore >= need || compScore >= need;
  }

  function checkGameEnd(){
    const need = Math.floor(bestOf/2)+1;
    if(playerScore >= need || compScore >= need){
      setTimeout(()=> {
        if(playerScore > compScore){
          roundResultEl.className='round-result win';
          document.getElementById('front-page').style.display='block';
          document.getElementById('front-page').style.backgroundImage="url('panalo.png')";
          roundResultEl.textContent = `🏆 You won the match! (${playerScore} - ${compScore})`;
        } else {
          roundResultEl.className='round-result lose';
          document.getElementById('front-page').style.display='block';
          document.getElementById('front-page').style.backgroundImage="url('talo.png')";
          roundResultEl.textContent = `💀 You lost the match. (${playerScore} - ${compScore})`;
        }
        stopAuto();
      }, 200);
    }
  }

  choices.forEach(el => {
    el.addEventListener('click', ()=> playRound(el.dataset.move));
    el.addEventListener('keydown', (e)=> {
      if(e.key === 'Enter' || e.key === ' ' ) playRound(el.dataset.move);
    });
  });

  document.addEventListener('keydown', (e)=>{
    const k = e.key.toLowerCase();
    if(k === 'r') playRound('rock');
    if(k === 'p') playRound('paper');
    if(k === 's') playRound('scissors');
  });

  bestOfSelect.addEventListener('change', ()=>{
    bestOf = parseInt(bestOfSelect.value,10);
    resetGame();
  });

  resetBtn.addEventListener('click', resetGame);

  autoBtn.addEventListener('click', ()=> {
    autoplay = !autoplay;
    autoBtn.textContent = autoplay ? 'Stop Auto' : 'Auto Play';
    if(autoplay) startAuto(); else stopAuto();
  });

  soundBtn.addEventListener('click', ()=> {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? 'Sound On' : 'Sound Off';
  });

  function startAuto(){
    if(autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(()=> {
      if(isGameOver()) { stopAuto(); return; }
      const m = moves[Math.floor(Math.random()*moves.length)];
      playRound(m);
    }, 900);
  }

  function stopAuto(){
    autoplay = false;
    if(autoplayInterval) clearInterval(autoplayInterval);
    autoBtn.textContent = 'Auto Play';
  }

  function resetGame(){
    playerScore = 0; compScore = 0; rounds = 0;
    playerHand.querySelector('.emoji').textContent = '❔';
    compHand.querySelector('.emoji').textContent = '❔';
    roundResultEl.className='round-result draw';
    roundResultEl.textContent='Make your move!';
    updateUI();
    stopAuto();
  }

  resetGame();
  window.resetRPS = resetGame;
})();
