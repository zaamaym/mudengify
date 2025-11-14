document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("tableBody");
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const modal = document.createElement('div');
    modal.className = 'logout-modal';
    modal.innerHTML = `
      <div class="logout-backdrop"></div>
      <div class="logout-panel card">
        <span class="close-btn">&times;</span>
        <h3>Log Out</h3>
        <hr style="margin: 8px 0; opacity: 1;" />
        <p>Anda yakin akan keluar?</p>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
          <button id="logoutCancel" class="btn">Batal</button>
          <button id="logoutConfirm" class="btn danger">Keluar</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    });
    modal.querySelector('#logoutCancel').onclick = () => modal.remove();
    modal.querySelector('.logout-backdrop').onclick = () => modal.remove();

    modal.querySelector('#logoutConfirm').onclick = async () => {
      const user = JSON.parse(localStorage.getItem('mudengify_user') || "null");
      if (!user) {
        alert('User tidak ditemukan.');
        modal.remove();
        return;
      }
      if (user) {
        const key = `mudengify_status_${user.username}_${user.mapel}`;
        localStorage.removeItem(key);
      }
      localStorage.removeItem('mudengify_user');
      location.assign('index.html');
      modal.remove();
    };
  });
}
  Object.keys(localStorage).forEach(key => {
  if (key.startsWith("mudengify_result_")) {
    try {
      const result = JSON.parse(localStorage.getItem(key));
      const parts = key.split("_"); 
      const username = parts[2];
      const mapel = parts.slice(3).join("_");

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${username}</td>
        <td>${mapel}</td>
        <td>${result.total}</td>
        <td>${result.correct}</td>
        <td>${result.wrong}</td>
        <td>${result.unanswered}</td>
        <td>${result.score}</td>
        <td>${result.percent}%</td>
        <td><button class="btn nav-btn blue viewbtn" style="height:28px;" data-user="${username}" data-mapel="${mapel}">Lihat</button></td>
        <td><button class="btn small-btn primary resetbtn" data-user="${username}" data-mapel="${mapel}">Reset</button></td>
      `;
      tableBody.appendChild(row);
    } catch (e) {
      console.warn("Gagal parse:", key);
    }
  }
});

// setelah semua baris ditambahkan, tambahkan event listener:
    document.addEventListener("click", function(e) {
    if (e.target.classList.contains("viewbtn")) {
        const user = e.target.dataset.user;
        const mapel = e.target.dataset.mapel;
        const userObj = {
            user,
            Mapel: mapel,
        };
        localStorage.setItem("mudengify_admin_view", JSON.stringify(userObj));
        alert(`Lihat hasil untuk ${user} - ${mapel}`);
        // di sini bisa kamu arahkan ke halaman lain, contoh:
        location.assign('review_admin.html');
    }

    if (e.target.classList.contains("resetbtn")) {
        const user = e.target.dataset.user;
        const mapel = e.target.dataset.mapel;
        const modal = document.createElement('div');
        modal.className = 'reset-modal';
        modal.innerHTML = `
        <div class="reset-backdrop"></div>
        <div class="reset-panel card">
        <span class="close-btn">&times;</span>
            <h3>Reset Ujian</h3>
            <hr style="margin: 8px 0; opacity: 1;" />
            <p>Anda yakin akan menghapus data ujian? Data ujian ${user} akan hilang!</p>
            <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
            <button id="resetCancel" class="btn">Batal</button>
            <button id="resetConfirm" class="btn danger">Iya, Hapus</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.close-btn').onclick = () => modal.remove();
        modal.querySelector('#resetCancel').onclick = () => modal.remove();
        modal.querySelector('.reset-backdrop').onclick = () => modal.remove();

        modal.querySelector('#resetConfirm').onclick = async () => {
        if (!user) {
            alert('User tidak ditemukan.');
            modal.remove();
            return;
        }
        else{
        const Adm = localStorage.setItem("mudengify_admin_view", JSON.stringify(userObj));
        const Res = `mudengify_result_${user}_${mapel}`;
        const timerKey = `mudengify_timer_${user}_${mapel}`;
        const status = `mudengify_status_${user}_${mapel}`;
        const UserAns = `mudengify_answer_${user}_${mapel}`;
        localStorage.removeItem(timerKey);
        localStorage.removeItem(Res);
        localStorage.removeItem(UserAns);
        localStorage.removeItem(status);
        localStorage.removeItem(Adm);
        e.target.closest("tr").remove(); // hapus baris dari tabel
        alert('Data ujian dihapus...');
        modal.remove();
        location.assign('admin.html');
        }
        };
    }
    });
});
