import { useState, useRef } from 'react'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../config/cloudinary'

export default function UploadForm({ onSuccess }) {
  const [step, setStep] = useState(1)
  const [duoPerso, setDuoPerso] = useState('')
  const [duoPartenaire, setDuoPartenaire] = useState('')
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const canNext1 = duoPerso.trim() && duoPartenaire.trim()
  const canSubmit = photo

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const img = new Image()
      img.onload = () => {
        const MAX = 1200
        let w = img.width, h = img.height
        if (w > MAX) { h = (h * MAX) / w; w = MAX }
        if (h > MAX) { w = (w * MAX) / h; h = MAX }
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        canvas.toBlob(resolve, 'image/jpeg', 0.82)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const compressed = await compressImage(photo)
      const fd = new FormData()
      fd.append('file', compressed)
      fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      fd.append('context', `duo_perso=${duoPerso}|duo_partenaire=${duoPartenaire}`)
      fd.append('tags', `duo,${duoPerso},${duoPartenaire}`)
      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload échoué')
      const data = await res.json()
      onSuccess({ duoPerso, duoPartenaire, url: data.secure_url })
    } catch (e) {
      setError("Oups, une erreur s'est produite. Réessaie !")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-wrapper">
      <div className="ticket-outer">

        {/* Header */}
        <div className="ticket-header">
          <div className="header-left">
            <span className="logo-badge">BWF</span>
          </div>
          <div className="header-center">
            <p className="header-event">BABYLON WEDDING FESTIVAL</p>
            <p className="header-date">11 · AVRIL · 2026</p>
          </div>
          <div className="header-right">
            <p className="header-seat">LE JEU</p>
            <p className="header-seat-big">DU DUO</p>
          </div>
        </div>

        <div className="perfo" />

        {/* Steps */}
        <div className="ticket-body">
          <div className="steps-row">
            {[1,2].map(s => (
              <div key={s} className={`step-pip ${step === s ? 'active' : step > s ? 'done' : ''}`}>
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>

          {/* STEP 1 — Duo */}
          {step === 1 && (
            <div className="step-content">
              <p className="step-title">TON DUO</p>
              <div className="field">
                <label>TON PERSONNAGE</label>
                <input
                  className="stamp-input"
                  placeholder="ex: Timon"
                  value={duoPerso}
                  onChange={e => setDuoPerso(e.target.value)}
                />
              </div>
              <div className="duo-plus">+</div>
              <div className="field">
                <label>TON PARTENAIRE</label>
                <input
                  className="stamp-input"
                  placeholder="ex: Pumba"
                  value={duoPartenaire}
                  onChange={e => setDuoPartenaire(e.target.value)}
                />
              </div>
              <button className="btn-main" disabled={!canNext1} onClick={() => setStep(2)}>SUIVANT →</button>
            </div>
          )}

          {/* STEP 2 — Photo */}
          {step === 2 && (
            <div className="step-content">
              <p className="step-title">VOTRE PHOTO DE DUO</p>
              <div className="photo-drop" onClick={() => fileRef.current.click()}>
                {preview
                  ? <img src={preview} alt="preview" className="photo-preview" />
                  : (
                    <div className="photo-placeholder">
                      <div className="photo-icon">📸</div>
                      <p>Clique pour ajouter votre photo</p>
                    </div>
                  )
                }
                {preview && <div className="photo-overlay">CHANGER</div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={handlePhoto} />
              {error && <p className="error-msg">{error}</p>}
              <div className="duo-tag">
                <span className="duo-badge">{duoPerso}</span>
                <span className="duo-sep">&</span>
                <span className="duo-badge">{duoPartenaire}</span>
              </div>
              <div className="btn-row">
                <button className="btn-secondary" onClick={() => setStep(1)}>← RETOUR</button>
                <button className="btn-main" disabled={!canSubmit || loading} onClick={handleSubmit}>
                  {loading ? 'ENVOI...' : 'VALIDER 🎉'}
                </button>
              </div>
            </div>
          )}
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
