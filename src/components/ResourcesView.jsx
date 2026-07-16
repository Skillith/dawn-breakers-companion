import React from 'react';
import { BookOpen, Download, FileText, Info, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';

export default function ResourcesView() {
  return (
    <div className="resources-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Introduction Card */}
      <div className="resource-hero-card" style={{
        background: 'var(--panel-bg)',
        border: '1px solid var(--panel-border)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: 'var(--card-shadow)',
        backdropFilter: 'blur(15px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05, pointerEvents: 'none' }}>
          <BookOpen size={200} className="text-secondary" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', color: 'var(--accent-color)', marginBottom: '0.75rem' }}>
          Fársí Names & Transliteration Guide
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '800px', lineHeight: '1.7' }}>
          This reference guide outlines the structure of Persian (Fársí) names in the 1800s and explains the transliteration system used in *The Dawn-Breakers*. Diacritical marks help readers pronounce terms and names correctly, preventing confusion and preserving their original phonetic beauty.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* PDF Download Card */}
        <div className="resource-card" style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--card-shadow)',
          backdropFilter: 'blur(15px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: '4px solid var(--accent-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <FileText size={24} style={{ color: 'var(--accent-color)' }} />
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', margin: 0 }}>Official Reference Document</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Download the official Fársí Transliteration guide as a PDF. It contains detailed pronunciation rules, prefix lists, and attribution mechanics.
            </p>
            <div style={{
              background: 'rgba(184, 134, 11, 0.04)',
              border: '1px dashed var(--panel-border)',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem'
            }}>
              <strong>File Name:</strong> 3.-Farsi-Names-Transliteration_2025-08-01.pdf<br />
              <strong>Topic:</strong> Construction of Fársí Names in the 1800s
            </div>
          </div>
          
          <a 
            href="/3.-Farsi-Names-Transliteration_2025-08-01.pdf" 
            download="3.-Farsi-Names-Transliteration_2025-08-01.pdf"
            className="action-btn primary"
            style={{
              textDecoration: 'none',
              justifyContent: 'center',
              width: '100%',
              padding: '0.9rem'
            }}
          >
            <Download size={18} />
            Download PDF Guide
          </a>
        </div>

        {/* Name Construction Card */}
        <div className="resource-card" style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--card-shadow)',
          backdropFilter: 'blur(15px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Info size={24} style={{ color: 'var(--accent-color)' }} />
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', margin: 0 }}>Name Structure</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Persian names in the 19th century were typically constructed using three distinct components:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'var(--accent-color)',
                color: '#fff',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                flexShrink: 0
              }}>1</div>
              <div>
                <strong style={{ color: 'var(--accent-color)' }}>Prefix:</strong> Mírzá, Mullá, Siyyid, Hájí, or Shaykh (religious or noble titles).
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'var(--accent-color)',
                color: '#fff',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                flexShrink: 0
              }}>2</div>
              <div>
                <strong style={{ color: 'var(--accent-color)' }}>Given Name:</strong> Often constructed from names of the Prophet Muhammad, the Shia Imáms, or their family members.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'var(--accent-color)',
                color: '#fff',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                flexShrink: 0
              }}>3</div>
              <div>
                <strong style={{ color: 'var(--accent-color)' }}>Identifying Attribution:</strong> A gentilic name denoting origin, birth place, or occupation (e.g., *Shírází* from Shiraz).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prefixes Section */}
      <div style={{
        background: 'var(--panel-bg)',
        border: '1px solid var(--panel-border)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--card-shadow)',
        backdropFilter: 'blur(15px)'
      }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--accent-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={20} />
          Common Prefixes & Honorifics
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Prefixes indicate a person's heritage, education, religious pilgrimage, or social standing.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: "Hájí", desc: "Signifies that the person has completed the pilgrimage (Hajj) to Mecca." },
            { name: "Mírzá", desc: "A contraction of Amír-Zádih (son of an Amír). When prefixed to a name, it means Mr. / nobleman. When affixed to a name at the end, it denotes prince." },
            { name: "Mullá", desc: "An honorific title for a member of the Islamic clergy (religious leaders). Signifies higher education in theology and Shari'ah law. The plural is 'ulamá." },
            { name: "Shaykh", desc: "Signifies the head of a group, tribe, or region. Often used as a general title of respect for scholars." },
            { name: "Siyyid", desc: "Signifies that the person is a direct descendant of the Prophet Muhammad." }
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(26, 20, 18, 0.02)',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              padding: '1rem',
              borderLeft: '3px solid var(--accent-color)'
            }} className="prefix-item">
              <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--accent-color)', fontFamily: 'var(--font-title)' }}>
                {item.name}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem', lineHeight: '1.5' }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Attributions and Inflections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Genitive Inflection Card */}
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--card-shadow)',
          backdropFilter: 'blur(15px)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', color: 'var(--accent-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} />
            Attributions & Genitives
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            In the absence of formal surnames, attributions are appended to names to specify origin or profession.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
            <div style={{ background: 'rgba(26, 20, 18, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
              <strong>The Genitive Liaison (-i-):</strong> Denotes "of" or "from". For example, "Muhammad from Núr" is transliterated as <em>Muhammad-i-Núrí</em>.
            </div>
            <div style={{ background: 'rgba(26, 20, 18, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
              <strong>The Gentilic Suffix (-í):</strong> Added after locations to indicate origin:
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <li>Shíráz <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> <strong>Shírází</strong> (from Shíráz)</li>
                <li>Tabríz <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> <strong>Tabrízí</strong> (from Tabríz)</li>
                <li>Qazvín <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> <strong>Qazvíní</strong> (from Qazvín)</li>
              </ul>
            </div>
            <div style={{ background: 'rgba(26, 20, 18, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
              <strong>Arabic Inflection (ibn / bin):</strong> Denotes "son of". For example, <em>'Alí-ibn-Abí Tálib</em> means "'Alí, son of Abí Tálib".
            </div>
          </div>
        </div>

        {/* Transliteration Systems Comparison */}
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--card-shadow)',
          backdropFilter: 'blur(15px)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', color: 'var(--accent-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} />
            Transliteration Differences
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            *The Dawn-Breakers* study companion follows the original 1930s transliteration system of the English *Dawn-Breakers* translation (except letter underlining is omitted for web readability). This system differs slightly from modern standards:
          </p>
          
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
            textAlign: 'left',
            marginTop: '0.5rem'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.5rem' }}>Term</th>
                <th style={{ padding: '0.5rem' }}>Original System</th>
                <th style={{ padding: '0.5rem' }}>Modern System</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Shiraz</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-color)' }}>Shíráz</td>
                <td style={{ padding: '0.5rem' }}>Shīrāz</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Barfurushi</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-color)' }}>Bárfurúshí</td>
                <td style={{ padding: '0.5rem' }}>Bārfurūshī</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Ali</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-color)' }}>'Alí</td>
                <td style={{ padding: '0.5rem' }}>‘Alī</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Fatima</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-color)' }}>Fátimih (Fársí)</td>
                <td style={{ padding: '0.5rem' }}>Fátima (Arabic)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Madrasa</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-color)' }}>madrisih (Fársí)</td>
                <td style={{ padding: '0.5rem' }}>madrasa (Arabic)</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
