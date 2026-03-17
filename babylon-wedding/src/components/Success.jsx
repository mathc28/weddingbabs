export default function Success({ data, onReset }) {
  return (
    <div className="form-wrapper">
      <div className="ticket-outer success-ticket">
        <div className="ticket-header">
          <div className="header-left">
            <span className="logo-badge">BWF</span>
          </div>
          <div className="header-center">
            <p className="header-event">BABYLON WEDDING FESTIVAL</p>
            <p className="header-date">11 · AVRIL · 2026</p>
          </div>
          <div className="header-right">
            <p className="header-seat">PASS</p>
            <p className="header-seat-big">DUO</p>
          </div>
        </div>

        <div className="perfo" />

        <div className="ticket-body success-body">
          <div className="success-check">✓</div>
          <p className="success-title">PHOTO ENVOYÉE !</p>
          <p className="success-sub">Merci {data.prenom}, votre duo a bien été enregistré</p>

          <div className="success-photo-wrap">
            <img src={data.url} alt="duo" className="success-photo" />
          </div>

          <div className="success-duo-row">
            <span className="duo-badge">{data.duoPerso}</span>
            <span className="duo-heart">♥</span>
            <span className="duo-badge">{data.duoPartenaire}</span>
          </div>

          <p className="success-msg">
            Les mariés recevront toutes les photos à la fin de la soirée 🎊
          </p>

          <button className="btn-main" onClick={onReset}>
            NOUVELLE ENTRÉE
          </button>
        </div>

        <div className="perfo" />
        <div className="ticket-stub">
          <span>MAÏLYS & KÉVIN</span>
          <span>DOMAINE VALSOYO</span>
          <span>11.04.2026</span>
        </div>
      </div>
    </div>
  )
}
