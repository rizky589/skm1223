from flask import Flask, render_template, redirect, url_for, request, flash
from config import Config
from models import db, Admin, SurveyResponse
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
from sqlalchemy import func

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

login = LoginManager(app)
login.login_view = 'login'

@login.user_loader
def load_user(id):
    return Admin.query.get(int(id))

@app.route('/')
def index():
    responses = SurveyResponse.query.all()
    count = len(responses)
    avg_prosedur = sum(r.q2 for r in responses) / count if count > 0 else 0
    avg_waktu = sum(r.q3 for r in responses) / count if count > 0 else 0
    avg_sarana = sum(r.q6 for r in responses) / count if count > 0 else 0
    
    sum_all_q = sum((r.q1 + r.q2 + r.q3 + r.q4 + r.q5 + r.q6 + r.q7 + r.q8 + r.q9 + r.q10 + r.q11 + r.q12 + r.q13 + r.q14 + r.q15) for r in responses)
    avg_total = sum_all_q / (count * 15) if count > 0 else 0
    
    stats = {
        'avg_prosedur': f"{avg_prosedur:.2f}",
        'avg_waktu': f"{avg_waktu:.2f}",
        'avg_sarana': f"{avg_sarana:.2f}",
        'avg_total': f"{avg_total:.2f}",
        'total_responden': count
    }
    return render_template('index.html', stats=stats)

@app.route('/input', methods=['GET', 'POST'])
def input_survey():
    if request.method == 'POST':
        try:
            resp = SurveyResponse(
                nama=request.form.get('nama'),
                email=request.form.get('email'),
                no_hp=request.form.get('no_hp'),
                jenis_kelamin=request.form.get('jenis_kelamin'),
                pendidikan=request.form.get('pendidikan'),
                pekerjaan=request.form.get('pekerjaan'),
                jenis_layanan=request.form.get('jenis_layanan'),
                q1=int(request.form.get('q1', 0)),
                q2=int(request.form.get('q2', 0)),
                q3=int(request.form.get('q3', 0)),
                q4=int(request.form.get('q4', 0)),
                q5=int(request.form.get('q5', 0)),
                q6=int(request.form.get('q6', 0)),
                q7=int(request.form.get('q7', 0)),
                q8=int(request.form.get('q8', 0)),
                q9=int(request.form.get('q9', 0)),
                q10=int(request.form.get('q10', 0)),
                q11=int(request.form.get('q11', 0)),
                q12=int(request.form.get('q12', 0)),
                q13=int(request.form.get('q13', 0)),
                q14=int(request.form.get('q14', 0)),
                q15=int(request.form.get('q15', 0)),
                saran=request.form.get('saran')
            )
            db.session.add(resp)
            db.session.commit()
            flash('Terima kasih atas partisipasi Anda dalam Survei Kepuasan Masyarakat ini.', 'success')
            return redirect(url_for('index'))
        except Exception as e:
            flash('Terjadi kesalahan. Pastikan semua kolom nilai terisi dengan benar (1-10).', 'error')
            
    return render_template('form.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        admin = Admin.query.filter_by(username=username).first()
        if admin is None or not admin.check_password(password):
            flash('Invalid username or password', 'error')
            return redirect(url_for('login'))
        login_user(admin)
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/admin')
@login_required
def dashboard():
    responses = SurveyResponse.query.order_by(SurveyResponse.created_at.desc()).all()
    return render_template('admin/dashboard.html', responses=responses)

def init_db():
    with app.app_context():
        db.create_all()
        if not Admin.query.filter_by(username='admin').first():
            admin = Admin(username='admin')
            admin.set_password('bps123') # Default password for testing
            db.session.add(admin)
            db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
