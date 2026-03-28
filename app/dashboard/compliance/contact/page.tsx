'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Reusable Tooltip Component
const TooltipLabel = ({ label, required, tooltipText }: { label: string, required?: boolean, tooltipText?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <label className="input-label" style={{ margin: 0 }}>
          {label} {required && <span className="required-star">*</span>}
        </label>
        {tooltipText && (
          <button 
            type="button" 
            onClick={() => setShow(!show)} 
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-light)', cursor: 'pointer', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', padding: 0, opacity: 0.7 }}
            title="Click for more info"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        )}
      </div>
      {show && tooltipText && (
        <div style={{ fontSize: '13px', padding: '10px 12px', backgroundColor: 'var(--bg-overlay)', borderRadius: '6px', marginTop: '6px', borderLeft: '3px solid var(--brand-primary)', opacity: 0.9, lineHeight: 1.4 }}>
          {tooltipText}
        </div>
      )}
    </div>
  );
};

// Comprehensive Nigeria States & LGAs Map
const NIGERIA_STATES: Record<string, string[]> = {
  "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umunneochi"],
  "Adamawa": ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
  "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
  "Anambra": ["Aba", "Anambra East", "Anambra West", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
  "Bauchi": ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
  "Bayelsa": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
  "Benue": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balega", "Toro", "Warji", "Zaki"],
  "Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
  "Cross River": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
  "Delta": ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
  "Ebonyi": ["Abi", "Akamkpa", "Boki", "Degema", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
  "Edo": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  "Ekiti": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
  "Enugu": ["Akoko-Edo", "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  "FCT - Abuja": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"],
  "Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
  "Imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
  "Jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Kaugama", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
  "Kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
  "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
  "Katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
  "Kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
  "Kogi": ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
  "Kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
  "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  "Nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
  "Niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
  "Ogun": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
  "Ondo": ["Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu", "Yewa North", "Yewa South"],
  "Osun": ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun", "Ise/Orun", "Moba", "Oye"],
  "Oyo": ["Afijio", "Akinyele", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
  "Plateau": ["Bokkos", "Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
  "Rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
  "Sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
  "Taraba": ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
  "Yobe": ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari"],
  "Zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"]
};

export default function ContactPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    generalEmail: '',
    supportEmail: '',
    disputesEmail: '',
    phone: '',
    website: '',
    twitter: '',
    facebook: '',
    instagram: '',
    state: '',
    lga: '',
    city: '',
    street: '',
    building: ''
  });

  const handleSaveAndNext = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard/compliance/account');
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      state: e.target.value,
      lga: '' // Reset LGA when state changes
    });
  };

  const availableLGAs = formData.state ? NIGERIA_STATES[formData.state] || [] : [];

  return (
    <form onSubmit={handleSaveAndNext}>
      <h2 className="page-title">Contact Details</h2>

      {/* SECTION 1: EMAILS */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', opacity: 0.9 }}>Email Addresses</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <TooltipLabel label="General email" required tooltipText="Your primary business email address. This is where we will send general updates and newsletters." />
            <input 
              type="email" 
              className="input-field" 
              placeholder="hello@yourbusiness.com" 
              required 
              value={formData.generalEmail}
              onChange={e => setFormData({...formData, generalEmail: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <TooltipLabel label="Support email" required tooltipText="Where should your customers contact you for help? This email may be shown on their transaction receipts." />
            <input 
              type="email" 
              className="input-field" 
              placeholder="support@yourbusiness.com" 
              required 
              value={formData.supportEmail}
              onChange={e => setFormData({...formData, supportEmail: e.target.value})}
            />
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '20px' }}>
          <TooltipLabel label="Disputes email" required tooltipText="CRITICAL: Where should we send chargeback, fraud, and dispute notices? Failure to respond to emails here can lead to reversed payments." />
          <input 
            type="email" 
            className="input-field" 
            placeholder="Enter dispute email and press enter" 
            required 
            value={formData.disputesEmail}
            onChange={e => setFormData({...formData, disputesEmail: e.target.value})}
          />
        </div>
      </div>

      {/* SECTION 2: PHONE & SOCIALS */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', opacity: 0.9 }}>Phone & Online Presence</h3>
        
        <div className="input-group">
          <TooltipLabel label="Phone number" required tooltipText="Your official business phone number. We may use this to verify your account or reach you during emergencies." />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '70px', padding: '10px 0', border: '1px solid var(--border-light)', borderRadius: '6px', textAlign: 'center', background: 'var(--bg-overlay)', fontSize: '14px', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              +234
            </div>
            <input 
              type="tel" 
              className="input-field" 
              placeholder="800 000 0000" 
              required 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
            />
          </div>
        </div>

        <span className="help-text" style={{ marginBottom: '16px', fontSize: '13px' }}>Provide the online channels you use to engage with your customers.</span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <TooltipLabel label="Website" required tooltipText="A valid URL to your business website or digital storefront." />
            <input type="url" className="input-field" placeholder="https://" required value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <TooltipLabel label="Twitter handle" />
            <input type="text" className="input-field" placeholder="@" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <TooltipLabel label="Facebook username" />
            <input type="text" className="input-field" placeholder="/" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <TooltipLabel label="Instagram handle" />
            <input type="text" className="input-field" placeholder="@" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
          </div>
        </div>
      </div>

      {/* SECTION 3: OFFICE ADDRESS */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', opacity: 0.9 }}>Office Address</h3>

        <div className="input-group">
          <TooltipLabel label="Country" />
          <input type="text" className="input-field" value="Nigeria" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <TooltipLabel label="State or region" required />
            <select className="input-select" required value={formData.state} onChange={handleStateChange}>
              <option value="">Choose state...</option>
              {Object.keys(NIGERIA_STATES).sort().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <TooltipLabel label="LGA (Local Government Area)" required />
            <select className="input-select" required disabled={!formData.state} value={formData.lga} onChange={e => setFormData({...formData, lga: e.target.value})}>
              <option value="">Choose LGA...</option>
              {availableLGAs.map(lga => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '20px' }}>
          <TooltipLabel label="City" required />
          <input type="text" className="input-field" placeholder="E.g. Ikeja, Port Harcourt, Kano" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
        </div>

        <div className="input-group">
          <TooltipLabel label="Street address" required />
          <input type="text" className="input-field" placeholder="123 Main Street" required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
        </div>

        <div className="input-group">
          <TooltipLabel label="Complex or building (optional)" />
          <input type="text" className="input-field" placeholder="Building name, unit number or floor" value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
        <button type="submit" className="btn-primary">Save and Continue</button>
      </div>
    </form>
  );
}
