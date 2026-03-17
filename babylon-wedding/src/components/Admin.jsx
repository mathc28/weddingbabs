import { useState, useEffect } from 'react'
import { ADMIN_PASSWORD } from '../config/cloudinary'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Mot de passe incorrect')
    }
  }

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const searchRes = await fetch('/api/cloudinary-search')
      const data = await searchRes.json()
      setPhotos(data.resources || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) fetchPhotos()
  }, [authed])

  const getContext = (photo) => {
    const ctx = photo.context || {}
    return {
      duoPerso: ctx.duo_perso || '—',
      duoPartenaire: ctx.duo_partenaire || '—',
    }
  }

  if (!authed) {
    return (
      <div className="app">
        <div className="bg-pattern" />
        <div className="form-wrapper">
          <div className="ticket-outer">
            <div className="ticket-header">
              <div className="header-left"><span className="logo-badge">BWF</span></div>
              <div className="header-center">
                <p className="header-event">BABYLON WEDDING FESTIVAL</p>
                <p className="header-date">ESPACE ADMIN</p>
              </div>
            </div>
            <div className="perfo" />
            <div className="ticket-body">
              <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <p className="step-title">ACCÈS ADMIN</p>
                <div className="field">
                  <label>MOT DE PASSE</label>
                  <input
                    className="stamp-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="error-msg">{error}</p>}
                <button type="submit" className="btn-main">ENTRER →</button>
              </form>
            </div>
            <div className="perfo" />
            <div className="ticket-stub">
              <span>MAÏLYS & KÉVIN</span>
              <span>DOMAINE VALSOYO</span>
              <span>11.04.2026</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app" style={{alignItems:'flex-start', paddingTop:'32px'}}>
      <div className="bg-pattern" />
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:'900px',margin:'0 auto'}}>

        {/* Header admin */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px',padding:'0 8px'}}>
          <div>
            <p style={{fontFamily:'Bebas Neue, cursive',fontSize:'32px',color:'#FFD43B',letterSpacing:'3px'}}>
              GALERIE DES DUOS
            </p>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',fontWeight:'600',letterSpacing:'1px'}}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} reçue{photos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn-main" style={{width:'auto',padding:'10px 20px',fontSize:'14px'}} onClick={fetchPhotos}>
            ↻ ACTUALISER
          </button>
        </div>

        {loading && (
          <div style={{textAlign:'center',padding:'60px',color:'rgba(255,255,255,0.4)',fontFamily:'Bebas Neue, cursive',fontSize:'20px',letterSpacing:'2px'}}>
            CHARGEMENT...
          </div>
        )}

        {!loading && photos.length === 0 && (
          <div style={{textAlign:'center',padding:'60px',color:'rgba(255,255,255,0.3)',fontFamily:'Bebas Neue, cursive',fontSize:'18px',letterSpacing:'2px'}}>
            AUCUNE PHOTO POUR L'INSTANT
          </div>
        )}

        {/* Grille photos */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',gap:'16px',padding:'0 8px'}}>
          {photos.map(photo => {
            const ctx = getContext(photo)
            return (
              <div
                key={photo.public_id}
                onClick={() => setSelected(photo)}
                style={{
                  background:'linear-gradient(160deg, #FFD43B 0%, #F5A623 100%)',
                  borderRadius:'12px',
                  overflow:'hidden',
                  cursor:'pointer',
                  transition:'transform 0.2s',
                  boxShadow:'0 8px 24px rgba(0,0,0,0.4)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
              >
                <img
                  src={photo.secure_url}
                  alt={ctx.prenom}
                  style={{width:'100%',height:'180px',objectFit:'cover',display:'block'}}
                />
                <div style={{padding:'12px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{background:'#100800',color:'#FFD43B',fontFamily:'Bebas Neue, cursive',fontSize:'15px',letterSpacing:'1px',padding:'4px 12px',borderRadius:'100px'}}>
                      {ctx.duoPerso}
                    </span>
                    <span style={{fontSize:'14px',color:'rgba(0,0,0,0.4)',fontFamily:'Bebas Neue, cursive'}}>+</span>
                    <span style={{background:'#100800',color:'#FFD43B',fontFamily:'Bebas Neue, cursive',fontSize:'15px',letterSpacing:'1px',padding:'4px 12px',borderRadius:'100px'}}>
                      {ctx.duoPartenaire}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal photo */}
        {selected && (
          <div
            onClick={() => setSelected(null)}
            style={{
              position:'fixed',inset:0,
              background:'rgba(0,0,0,0.85)',
              display:'flex',alignItems:'center',justifyContent:'center',
              zIndex:100,padding:'24px'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background:'linear-gradient(160deg, #FFD43B 0%, #F5A623 100%)',
                borderRadius:'16px',overflow:'hidden',
                maxWidth:'480px',width:'100%',
                boxShadow:'0 30px 80px rgba(0,0,0,0.7)'
              }}
            >
              <img src={selected.secure_url} alt="" style={{width:'100%',maxHeight:'360px',objectFit:'cover',display:'block'}} />
              <div style={{padding:'16px 20px'}}>
                {(() => {
                  const ctx = getContext(selected)
                  return (
                    <>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',margin:'0 0 16px'}}>
                        <span style={{background:'#100800',color:'#FFD43B',fontFamily:'Bebas Neue, cursive',fontSize:'14px',letterSpacing:'1px',padding:'4px 14px',borderRadius:'100px'}}>{ctx.duoPerso}</span>
                        <span style={{fontFamily:'Bebas Neue, cursive',fontSize:'18px',color:'rgba(0,0,0,0.3)'}}>+</span>
                        <span style={{background:'#100800',color:'#FFD43B',fontFamily:'Bebas Neue, cursive',fontSize:'14px',letterSpacing:'1px',padding:'4px 14px',borderRadius:'100px'}}>{ctx.duoPartenaire}</span>
                      </div>
                      <div style={{display:'flex',gap:'10px'}}>
                        <a
                          href={selected.secure_url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          style={{flex:1,background:'#100800',color:'#FFD43B',fontFamily:'Bebas Neue, cursive',fontSize:'16px',letterSpacing:'2px',border:'none',borderRadius:'8px',padding:'12px',cursor:'pointer',textAlign:'center',textDecoration:'none',display:'block'}}
                        >
                          ↓ TÉLÉCHARGER
                        </a>
                        <button
                          onClick={() => setSelected(null)}
                          style={{background:'rgba(0,0,0,0.1)',color:'rgba(0,0,0,0.5)',fontFamily:'Bebas Neue, cursive',fontSize:'16px',letterSpacing:'2px',border:'none',borderRadius:'8px',padding:'12px 16px',cursor:'pointer'}}
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
