const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 3000;

app.get('/health', (req,res)=> res.json({ ok:true }));

const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Quiz Multiplayer Neon</title><style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;color:#fff;background:#0a0a12;min-height:100vh}.bg{position:fixed;inset:0;background:radial-gradient(circle at 20% 20%, #ff00ff22, transparent 50%), radial-gradient(circle at 80% 80%, #00ffff22, transparent 50%),

radial-gradient(circle at 50% 50%, #0a0a2a, #000);z-index:-1}header{text-align:center;padding:20px 10px}header h1{margin:0;font-size:2.2rem;letter-spacing:3px;text-shadow:0 0 15px #ff00ff,0 0 30px #00ffff}.card{max-width:520px;margin:20px auto;background:#15152acc;border:1px solid #ffffff22;border-radius:18px;padding:20px;backdrop-filter:blur(10px);box-shadow:0 0 20px #ff00ff33}input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #ffffff33;background:#00000088;color:#fff;margin:6px 0;font-size:1rem}.row{display:flex;gap:10px;margin:8px 0}.btn{flex:1;padding:12px;border:none;border-radius:10px;font-weight:700;cursor:pointer}.neon-pink{background:#ff00aa;color:#fff;box-shadow:0 0 15px #ff00aa}.neon-blue{background:#00ccff;color:#000;box-shadow:0 0 15px #00ccff}.neon-green{background:#00ff88;color:#000;box-shadow:0 0 15px #00ff88}.ghost{background:transparent;border:1px solid #fff3;color:#fff}.divider{text-align:center;opacity:.5;margin:10px 0}.rooms{margin-top:10px;display:grid;gap:8px}.roomItem{padding:10px 12px;background:#ffffff11;border-radius:10px;display:flex;justify-content:space-

between;cursor:pointer;border:1px solid #ffffff11}.error{color:#ff5588;min-height:18px}.players{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.player{background:#ffffff0f;padding:10px;border-radius:12px;text-align:center}.player.host{border:1px solid #ff00aa}.hidden{display:none!important}.topbar{display:flex;justify-content:space-between;font-weight:700;margin-bottom:10px}.timer{font-size:1.6rem;color:#00ffff}.options{display:grid;gap:10px}.opt{padding:14px;border-radius:12px;background:#ffffff12;border:1px solid #ffffff22;cursor:pointer;color:#fff;text-align:left}.opt.correct{background:#00ff8844;border-color:#00ff88}.opt.selected{border-color:#00ffff;box-shadow:0 0 12px #00ffff88}</style></head><body><div class="bg"></div><header><h1>⚡ QUIZ NEON</h1><p>Multiplayer em tempo real</p></header><div id="screen-lobby" class="card"><input id="playerName" placeholder="Seu nome" maxlength="12"><div class="row"><button id="btnCreatePublic" class="btn neon-pink">Criar Sala Publica</button><button id="btnCreatePrivate" class="btn neon-blue">Criar Sala Privada</button></div><div class="divider">ou entrar com codigo</div><div class="row"><input id="roomCode" placeholder="CODIGO" style="text-transform:uppercase"><button id="btnJoin" class="btn neon-green">Entrar</button></div><div id="roomsList" class="rooms"></div><p id="error" class="error"></p></div><div id="screen-room" class="card hidden"><h2>Sala: <span id="roomCodeDisplay"></span></h2><span id="hostBadge"></span><div id="playersGrid" class="players"></div><button id="btnStart" class="btn neon-pink hidden">🚀 Iniciar Jogo (Host)</button><button id="btnLeave" class="btn ghost">Sair</button></div><div id="screen-game" class="card hidden"><div class="topbar"><span id="qCount"></span><span id="timer" class="timer">15</span></div><h2 id="questionText"></h2><div id="options" class="options"></div></div><div id="screen-end" class="card hidden"><h2>🏆 Placar Final</h2><div id="finalBoard"></div><button onclick="location.reload()" class="btn neon-blue">Jogar Novamente</button></div><script src="/socket.io/socket.io.js"></script><script>const socket=io();const $=id=>document.getElementById(id);let myCode=null,myId=null;socket.on('connect',()=>{myId=socket.id;socket.emit('getRooms');});$('btnCreatePublic').onclick=()=>createRoom(false);$('btnCreatePrivate').onclick=()=>createRoom(true);$

('btnJoin').onclick=()=>joinRoom();$('btnStart').onclick=()=>socket.emit('startGame',{code:myCode});$('btnLeave').onclick=()=>location.reload();function createRoom(isPrivate){const name=$('playerName').value.trim()||'Host';socket.emit('createRoom',{name,isPrivate});}function joinRoom(){const name=$('playerName').value.trim()||'Jogador';const code=$('roomCode').value.trim().toUpperCase();if(!code)return showErr('Digite o codigo!');socket.emit('joinRoom',{name,code});}socket.on('roomsList',list=>{const el=$('roomsList');el.innerHTML='';if(!list.length)el.innerHTML='<small style="opacity:.5">Nenhuma sala publica - crie uma!</small>';list.forEach(r=>{const d=document.createElement('div');d.className='roomItem';d.innerHTML='<span>🟢 Sala '+r.code+'</span><span>'+r.players+' jogadores</span>';d.onclick=()=>{$('roomCode').value=r.code;joinRoom();};el.appendChild(d);});});socket.on('joined',({code,isHost:h})=>{myCode=code;$('screen-lobby').classList.add('hidden');$('screen-room').classList.remove('hidden');$('roomCodeDisplay').textContent=code;$('hostBadge').textContent=h?'👑 Voce e o Host':'';if(h)$('btnStart').classList.remove('hidden');});socket.on('roomUpdate',data=>{const grid=$('playersGrid');grid.innerHTML='';Object.entries(data.players).forEach(([id,p])=>{const div=document.createElement('div');div.className='player'+(id===data.host?' host':'');div.innerHTML='<div style="font-size:1.8rem">'+p.avatar+'</div><b>'+p.name+'</b><br><span style="color:#00ff88">'+p.score+' pts</span>';grid.appendChild(div);});if(data.host===myId)$('btnStart').classList.remove('hidden');});socket.on('question',q=>{$('screen-room').classList.add('hidden');$('screen-game').classList.remove('hidden');$('qCount').textContent='Pergunta '+q.num+'/'+q.total;$('questionText').textContent=q.q;$('timer').textContent=q.timeLeft;const opts=$('options');opts.innerHTML='';q.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='opt';b.textContent=o;b.onclick=()=>{socket.emit('answer',{code:myCode,index:i});b.classList.add('selected');[...opts.children].forEach(c=>c.disabled=true);};opts.appendChild(b);});});socket.on('tick',t=>{$('timer').textContent=t;});socket.on('reveal',({correct})=>{const opts=$('options').children;[...opts].forEach((b,i)=>{if(i===correct)b.classList.add('correct');});});socket.on('finished',({players})=>{$('screen-game').classList.add('hidden');$('screen-end').classList.remove('hidden');const sorted=Object.values(players).sort((a,b)=>b.score-a.score);$('finalBoard').innerHTML=sorted.map((p,i)=>'<div class="player"><b>'+(i===0?'🏆 ':'')+p.avatar+' '+p.name+'</b> - '+p.score+' pts</div>').join('');});socket.on('errorMsg',m=>showErr(m));function showErr(m){$('error').textContent=m;setTimeout(()=>$('error').textContent='',3000);}</script></body></html>`;

app.get('/', (req,res)=> res.send(html));

const questions = [
  { q: "Qual planeta e conhecido como Planeta Vermelho?", opts: ["Venus","Marte","Jupiter","Saturno"], a: 1 },
  { q: "Quanto e 12 x 8?", opts: ["96","86","108","92"], a: 0 },
  { q: "Qual linguagem roda no navegador?", opts: ["Python","C++","JavaScript","Java"], a: 2 },
  { q: "Quem pintou a Mona Lisa?", opts: ["Van Gogh","Da Vinci","Picasso","Michelangelo"], a: 1 },
  { q: "O que significa HTML?", opts: ["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Logic","Host Text Markup Language"], a: 0 },
  { q: "Qual e o maior oceano?", opts: ["Atlantico","Indico","Artico","Pacifico"], a: 3 },
  { q: "Em que ano o Brasil foi descoberto?", opts: ["1500","1498","1502","1492"], a: 0 },
  { q: "Qual elemento quimico e Au?", opts: ["Prata","Aluminio","Ouro","Cobre"], a: 2 },
];
const rooms = {};
function genCode(){ return Math.random().toString(36).substring(2,6).toUpperCase(); }
function getPublicRooms(){ return Object.values(rooms).filter(r=>!r.isPrivate && r.state==='lobby').map(r=>({code:r.code, players:Object.keys(r.players).length})); }
function sendRoomUpdate(code){
  const r = rooms[code]; if(!r) return;
  io.to(code).emit('roomUpdate', { code, isPrivate: r.isPrivate, host: r.host, players: r.players, state: r.state });
  io.emit('roomsList', getPublicRooms());
}
io.on('connection', socket=>{
  socket.on('getRooms', ()=> socket.emit('roomsList', getPublicRooms()));
  socket.on('createRoom', ({name, isPrivate})=>{
    const code = genCode();
    rooms[code] = { code, isPrivate, host: socket.id, players: {}, state: 'lobby', currentQ: -1, timer: null, timeLeft: 0, answers: {} };
    rooms[code].players[socket.id] = { name: name||'Host', score:0, avatar: '👑' };
    socket.join(code); socket.emit('joined', { code, isHost:true }); sendRoomUpdate(code);
  });
  socket.on('joinRoom', ({name, code})=>{
    code = (code||'').toUpperCase(); const room = rooms[code];
    if(!room) return socket.emit('errorMsg','Sala nao encontrada!');
    if(Object.keys(room.players).length>=8) return socket.emit('errorMsg','Sala cheia!');
    const avs = ['⚡','🔥','💎','🚀','👾','🎮','🤖','🦊'];
    room.players[socket.id] = { name: name||'Jogador', score:0, avatar: avs[Object.keys(room.players).length % 8] };
    socket.join(code); if(!room.host) room.host=socket.id;
    socket.emit('joined', { code, isHost: room.host===socket.id }); sendRoomUpdate(code);
  });
  socket.on('startGame', ({code})=>{
    const room = rooms[code]; if(!room || room.host!==socket.id) return;
    room.state='playing'; room.currentQ=-1; Object.values(room.players).forEach(p=>p.score=0); nextQuestion(code);
  });
  socket.on('answer', ({code, index})=>{
    const room = rooms[code]; if(!room || room.state!=='playing') return;
    if(room.answers[socket.id]!==undefined) return;
    room.answers[socket.id]=index;

if(questions[room.currentQ].a===index){ const bonus = Math.floor(room.timeLeft*5); room.players[socket.id].score += 100 + bonus; }
    sendRoomUpdate(code);
    if(Object.keys(room.answers).length===Object.keys(room.players).length){
      clearInterval(room.timer);
      io.to(code).emit('reveal', { correct: questions[room.currentQ].a });
      setTimeout(()=>nextQuestion(code), 3000);
    }
  });
  socket.on('disconnect', ()=>{
    for(const code in rooms){
      const r = rooms[code];
      if(r.players[socket.id]){
        delete r.players[socket.id];
        if(Object.keys(r.players).length===0) delete rooms[code];
        else { if(r.host===socket.id) r.host = Object.keys(r.players)[0]; sendRoomUpdate(code); }
      }
    }
  });
  function nextQuestion(code){
    const room = rooms[code]; if(!room) return;
    room.currentQ++; room.answers={};
    if(room.currentQ>=questions.length){
      room.state='finished'; io.to(code).emit('finished', { players: room.players });
      setTimeout(()=>{ room.state='lobby'; room.currentQ=-1; sendRoomUpdate(code); }, 8000); return;
    }
    room.timeLeft=15;
    io.to(code).emit('question', { num: room.currentQ+1, total: questions.length, ...questions[room.currentQ], timeLeft: room.timeLeft });
    room.timer = setInterval(()=>{
      room.timeLeft--; io.to(code).emit('tick', room.timeLeft);
      if(room.timeLeft<=0){
        clearInterval(room.timer);
        io.to(code).emit('reveal', { correct: questions[room.currentQ].a });
        setTimeout(()=>nextQuestion(code), 3000);
      }
    },1000);
  }
});
server.listen(PORT, ()=> console.log('Neon Quiz na porta '+PORT));