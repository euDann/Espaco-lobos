import React, { useState, useEffect } from 'react';
import { listaTattoos as dadosIniciais } from './tattoos';

export default function App() {
  // PERSISTÊNCIA: Carrega do navegador ou usa os dados iniciais
  const [tattoos, setTattoos] = useState(() => {
    const salvo = localStorage.getItem('galeria_junior_lins');
    return salvo ? JSON.parse(salvo) : dadosIniciais;
  });

  const [filtro, setFiltro] = useState('Todos');
  const [isAdmin, setIsAdmin] = useState(false);
  const [clicks, setClicks] = useState(0);

  // Lógica do Clique Triplo (Gatilho Oculto)
  const handleLogoClick = () => {
    const novoValor = clicks + 1;
    setClicks(novoValor);

    if (novoValor === 3) {
      setIsAdmin(true);
      setClicks(0);
    }

    // Se ele não clicar 3 vezes em 2 segundos, o contador reseta
    setTimeout(() => setClicks(0), 2000);
  };

  useEffect(() => {
    localStorage.setItem('galeria_junior_lins', JSON.stringify(tattoos));
  }, [tattoos]);

  const categorias = ['Todos', 'Blackwork', 'Fine Line', 'Realismo'];
  const fotosExibidas = filtro === 'Todos' ? tattoos : tattoos.filter(t => t.categoria === filtro);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const categoriaSelecionada = document.getElementById('cat-select').value;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const novaTattoo = { id: Date.now(), categoria: categoriaSelecionada, titulo: "Nova Arte", url: reader.result };
        setTattoos([novaTattoo, ...tattoos]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerTattoo = (id) => {
    if(window.confirm("Deseja remover esta arte do portfólio?")) {
      setTattoos(tattoos.filter(t => t.id !== id));
    }
  };

  const linkZap = `https://wa.me/5521999999?text=${encodeURIComponent("Olá (nome), vi seu site e gostaria de um orçamento!")}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-600">
      
      {/* PAINEL ADMINISTRATIVO (SÓ ABRE COM 3 CLIQUES NO LOGO) */}
      {isAdmin && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">Dashboard Admin <span className="text-purple-600">.</span></h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Gerenciador DN Core v2.0</p>
              </div>
              <button onClick={() => setIsAdmin(false)} className="bg-zinc-900 hover:bg-white hover:text-black text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border border-white/10">Fechar Painel</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 sticky top-24 shadow-2xl">
                  <h3 className="text-[10px] font-bold uppercase mb-6 text-purple-400 tracking-[0.3em]">Upload de Trabalho</h3>
                  <div className="space-y-4">
                    <select id="cat-select" className="w-full bg-black border border-zinc-800 p-4 rounded-2xl text-xs outline-none focus:border-purple-600 text-zinc-300">
                      {categorias.filter(c => c !== 'Todos').map(c => <option key={c}>{c}</option>)}
                    </select>
                    <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-zinc-800 hover:border-purple-600/50 rounded-3xl cursor-pointer transition-all bg-black/40 group">
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-purple-400">Selecionar Foto</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <h3 className="text-[10px] font-bold uppercase text-zinc-500 tracking-[0.3em] mb-6">Suas Tatuagens ({tattoos.length})</h3>
                <div className="grid grid-cols-1 gap-3">
                  {tattoos.map(t => (
                    <div key={t.id} className="flex items-center justify-between bg-zinc-900/20 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-center gap-5">
                        <img src={t.url} className="w-16 h-16 object-cover rounded-xl border border-white/10" alt="" />
                        <div>
                          <p className="font-black text-xs uppercase italic">{t.titulo}</p>
                          <p className="text-[9px] text-purple-500 font-bold uppercase mt-1">{t.categoria}</p>
                        </div>
                      </div>
                      <button onClick={() => removerTattoo(t.id)} className="opacity-40 hover:opacity-100 text-red-500 p-4 rounded-xl text-[10px] font-bold uppercase transition-all tracking-widest">Apagar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SITE PÚBLICO --- */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* GATILHO OCULTO NO LOGO (3 CLIQUES) */}
          <h1 
            onClick={handleLogoClick}
            className="text-lg md:text-xl font-black italic tracking-tighter uppercase cursor-default select-none active:scale-95 transition-transform"
          >
            Junior Lins <span className="text-purple-600">.</span>
          </h1>
          <a href={linkZap} target="_blank" rel="noreferrer" className="bg-white text-black px-5 py-2 rounded-full font-bold text-[10px] hover:bg-purple-600 hover:text-white transition-all uppercase tracking-widest">Orçamento</a>
        </div>
      </nav>

      <header className="pt-32 pb-12 px-6 flex flex-col items-center">
        <div className="counter">Espaço Lobos • Belford Roxo</div>
        <h2 className="text-5xl md:text-8xl font-black mt-4 italic uppercase leading-none tracking-tighter text-center">
          ARTE NA <br /> <span className="text-zinc-800">PELE</span>
        </h2>
      </header>

      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex overflow-x-auto md:justify-center gap-2 pb-4 no-scrollbar">
          {categorias.map(cat => (
            <button key={cat} onClick={() => setFiltro(cat)} className={`flex-none px-8 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest border transition-all ${filtro === cat ? 'bg-purple-600 border-purple-600 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {fotosExibidas.map(foto => (
            <div key={foto.id} className="aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden relative group border border-white/5 shadow-2xl">
              <div className="absolute inset-0 bg-zinc-800 animate-pulse -z-10"></div>
              <img src={foto.url} alt="" className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                <div>
                  <p className="text-[9px] text-purple-400 font-bold uppercase tracking-[0.2em]">{foto.categoria}</p>
                  <h4 className="text-lg font-black italic uppercase tracking-tighter">{foto.titulo}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-32 border-t border-white/5 pt-20">
        <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.5em] text-purple-500 mb-12">Cuidados Pós-Arte</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <span className="text-3xl block mb-4 group-hover:scale-125 transition-transform duration-500">🧴</span>
            <h5 className="font-bold text-xs uppercase mb-3 tracking-widest">Higienização</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">Lave 3x ao dia com sabonete neutro. Seque apenas com batidinhas de papel toalha.</p>
          </div>
          <div className="text-center border-y md:border-y-0 md:border-x border-white/5 py-10 md:py-0 px-6 group">
            <span className="text-3xl block mb-4 group-hover:scale-125 transition-transform duration-500">☀️</span>
            <h5 className="font-bold text-xs uppercase mb-3 tracking-widest">Proteção</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">Não tome sol direto por 30 dias. Evite mar e piscina durante a primeira semana.</p>
          </div>
          <div className="text-center group">
            <span className="text-3xl block mb-4 group-hover:scale-125 transition-transform duration-500">🖐️</span>
            <h5 className="font-bold text-xs uppercase mb-3 tracking-widest">Cicatrização</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">Nunca arranque as casquinhas. Deixe a pele cicatrizar naturalmente e use pomada.</p>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-white/5 bg-zinc-950/30">
        <p className="text-zinc-800 text-[8px] tracking-[0.5em] uppercase italic">Design by DN Core • 2026</p>
      </footer>

      {/* BOTÕES FLUTUANTES */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-4">
        <a href="https://www.instagram.com/(instagram)/" target="_blank" rel="noreferrer" className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-float-delayed">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
        </a>
        <a href={linkZap} target="_blank" rel="noreferrer" className="bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-float">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.705 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
        </a>
      </div>
    </div>
  );
}
