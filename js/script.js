let tape = [];
let head = 0;
let currentState = "";
let transitions = [];
let acceptState = "";
let rejectState = "";
let stepCount = 0;
let initialState = "";
let initialTape = []; 
let runInterval = null;

document.getElementById('fileInput').addEventListener('change', function(e) {
  	const file = e.target.files[0];
  	if (!file) return;

 	const reader = new FileReader();
  
  	reader.onload = function(event) {
    	try {
      		const data = JSON.parse(event.target.result); 
      		
            // Sol Tablo Verilerini Güncelleme
            document.getElementById("info-states-count").textContent = data.states.length;
            document.getElementById("info-states-list").textContent = data.states.join(", ");
            document.getElementById("info-start").textContent = data.initial_state;
            document.getElementById("info-accept").textContent = data.accept_state;
            document.getElementById("info-reject").textContent = data.reject_state;

            // Sağ Tabloyu (Geçişleri) Doldurma
		  	let transRows = "";
		  	for (let i = 0; i < data.transitions.length; i++) {
                  let t = data.transitions[i];
		  		transRows += `<tr id="rule-${t.state}-${t.read}">
                    <td>${t.state}</td>
                    <td>${t.read}</td>
                    <td>${t.write}</td>
                    <td>${t.move}</td>
                    <td>${t.next_state}</td>
                </tr>`;
		  	}
		  	document.getElementById("transitions-body").innerHTML = transRows;

            // Simülasyon Değişkenlerini Kurma
            const inputStr = data.tape_input ? data.tape_input : "B";
		  	tape = inputStr.split("");
		  	currentState = data.initial_state;
		  	transitions = data.transitions;
		  	acceptState = data.accept_state;
		  	rejectState = data.reject_state;

		  	initialTape = [...tape]; 
		  	initialState = data.initial_state;

		  	head = 0; 
		  	stepCount = 0; 

		  	renderTape();
		  	updateStatus();
		  	clearLog();
		  	addLog("Dosya yüklendi. Düzenek hazır.");
            document.querySelector('.file-text').textContent = file.name;

		  	setButtons(true); 

    	} 
    	catch (err) {
      		console.error('Geçersiz JSON:', err.message);
            alert("JSON dosyası ayrıştırılamadı. Lütfen formatı kontrol edin.");
    	}
  	};

  	reader.readAsText(file);
});

function step() {
  if (currentState === acceptState || currentState === rejectState) return;

  const symbol = tape[head] !== undefined ? tape[head] : "B"; 

  const transition = transitions.find(
    t => t.state === currentState && t.read === symbol
  );

  // Aktif kural sınıflarını temizle
  document.querySelectorAll(".current-rule").forEach(el => el.classList.remove("current-rule"));

  if (!transition) {
    currentState = rejectState; 
    addLog(`Adım ${stepCount}: [${currentState}, ${symbol}] için geçiş bulunamadı → REJECTED`);
    renderTape();
    updateStatus();
    stopRun();
    return;
  }

  // Geçiş Satırını Vurgula
  const activeRow = document.getElementById(`rule-${transition.state}-${transition.read}`);
  if (activeRow) activeRow.classList.add("current-rule");

  const from = currentState;
  const read = symbol;

  tape[head] = transition.write; 
  currentState = transition.next_state; 
  
  if (transition.move === "R") {
      head++;
  } else if (transition.move === "L") {
      head--;
  }

  // Sonsuz bant korumaları
  if (head < 0) {
      tape.unshift("B");
      head = 0;
  }
  if (head >= tape.length) {
      tape.push("B");
  }

  stepCount++; 
  addLog(`Adım ${stepCount}: (${from}, ${read}) → yaz:${transition.write}, git:${transition.move} → ${currentState}`);

  renderTape();
  updateStatus();

  if (currentState === acceptState || currentState === rejectState) {
  	stopRun();
  }
}

function renderTape() {
  const container = document.getElementById("tape");
  container.innerHTML = "";

  tape.forEach((symbol, i) => {
    const cell = document.createElement("div");
    cell.className = "tape-cell";
    cell.textContent = symbol === "B" ? "_" : symbol; 
    if (i === head) {
    	cell.classList.add("active"); 
    }
    container.appendChild(cell);
  });
}

function updateStatus() {
  document.getElementById("current-state").textContent = currentState;
  document.getElementById("step-count").textContent = stepCount;
  document.getElementById("head-pos").textContent = head;

  const msg = document.getElementById("result-msg");
  msg.className = "value-badge"; // Sıfırla
  
  if (currentState === acceptState) {
    msg.textContent = "✓ Kabul Edildi";
    msg.classList.add("accept");
  } else if (currentState === rejectState) {
    msg.textContent = "✗ Reddedildi";
    msg.classList.add("reject");
  } else {
    msg.textContent = "Çalışıyor";
    msg.classList.add("running");
  }
}

function startRun() {
	if (runInterval) return; 
	document.getElementById("btn-run").textContent = "Durdur";
    document.getElementById("btn-run").classList.replace("btn-primary", "btn-secondary");

	runInterval = setInterval(() =>{
		step();
		if (currentState === acceptState || currentState === rejectState) {
			stopRun();
		}
	}, 400);
}

function stopRun() {
	clearInterval(runInterval);
	runInterval = null;
	document.getElementById("btn-run").textContent = "Çalıştır";
    document.getElementById("btn-run").classList.replace("btn-secondary", "btn-primary");
}

function reset() {
	stopRun(); 
	tape         = [...initialTape]; 
    head         = 0;                
    currentState = initialState;     
    stepCount    = 0;                

    // Vurguları temizle
    document.querySelectorAll(".current-rule").forEach(el => el.classList.remove("current-rule"));

    renderTape();
    updateStatus();
    clearLog();
    addLog("Sıfırlandı. Hazır.");
}

document.getElementById("btn-step").addEventListener("click", step);
document.getElementById("btn-run").addEventListener("click", function() {
	if (runInterval) stopRun();
	else startRun();
});
document.getElementById("btn-reset").addEventListener("click", reset);

function addLog(msg) {
	const log = document.getElementById("log");
	const entry = document.createElement("div"); 
	entry.className = "log-entry";
	entry.textContent = msg;
	log.appendChild(entry);
	log.scrollTop = log.scrollHeight;
}

function clearLog() {
	document.getElementById("log").innerHTML = "";
}

function setButtons(enabled) {
	document.getElementById("btn-step").disabled = !enabled;
	document.getElementById("btn-run").disabled = !enabled;
	document.getElementById("btn-reset").disabled = !enabled;
}