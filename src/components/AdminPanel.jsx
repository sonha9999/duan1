// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "../AdminPanel.css"; 

const DEFAULT_MATERIALS = [
  { id: "m1", brand: "Knauf · USG · Vĩnh Tường", name: "Tấm Thạch Cao Tiêu Chuẩn", desc: "Tấm 9mm, 12mm, 15mm. Dùng cho trần phẳng, trần thả, vách ngăn thông thường.", tags: "9.5mm|12mm|15mm", icon: "🧱" },
  { id: "m2", brand: "Knauf Aquapanel", name: "Tấm Thạch Cao Chống Ẩm", desc: "Lõi thạch cao phụ gia chống ẩm đặc biệt. Dùng cho phòng tắm, bếp, khu vực ẩm ướt.", tags: "Chống Ẩm|12mm|Xanh Lá", icon: "💧" },
  { id: "m3", brand: "USG Sheetrock", name: "Tấm Thạch Cao Chống Cháy", desc: "Lõi chứa Micro Silica & sợi thủy tinh. Đạt tiêu chuẩn chống cháy PCCC quốc tế.", tags: "Chống Cháy|REI 60", icon: "🔥" },
  { id: "m4", brand: "Vĩnh Tường · Gyproc", name: "Khung Thép Mạ Kẽm", desc: "Thanh C, U, V mạ kẽm nhúng nóng dày 0.45–0.55mm. Chống gỉ, bền 30 năm.", tags: "Thanh C|Thanh U|Mạ Kẽm", icon: "🔩" },
  { id: "m5", brand: "Rockwool · Isover", name: "Bông Khoáng Cách Nhiệt", desc: "Bông khoáng mật độ cao. Cách nhiệt & cách âm vượt trội, không cháy lan.", tags: "Cách Âm|Cách Nhiệt", icon: "🌡️" },
  { id: "m6", brand: "Dulux · Jotun · Kova", name: "Bột Bả & Sơn Nước", desc: "Bột trét Matit, Sika. Sơn nội ngoại thất cao cấp. Đủ màu theo NCS, RAL, Pantone.", tags: "Nội Thất|Ngoại Thất", icon: "🎨" },
  { id: "m7", brand: "Hilti · Fischer · Knauf", name: "Phụ Kiện Thi Công", desc: "Vít, băng lưới, hợp chất trám khe, kẹp trần, ty treo, nẹp góc inox chuyên dụng.", tags: "Vít|Băng Lưới|Nẹp Góc", icon: "🔧" },
  { id: "m8", brand: "Giao Hàng Toàn TP.HCM", name: "Mua Sỉ & Lẻ", desc: "Giá sỉ ưu đãi từ 100m². Giao hàng trong ngày tại TP.HCM, Bình Dương, Long An.", tags: "Trong Ngày|Giá Sỉ|COD", icon: "🚚" },
];

const DEFAULT_REVIEWS = [
  { id: "r1", name: "Anh Nguyễn Văn Tuấn", role: "Chủ hộ Vinhomes Grand Park", project: "🏠 Căn hộ 450m² · Trần giật cấp", stars: 5, text: "ThạchCaoSố1 hoàn thành toàn bộ trần giật cấp và vách ngăn penthouse 450m² chỉ trong 10 ngày. Bề mặt cực kỳ mịn, đường nét sắc sảo, đội thợ sạch sẽ and chuyên nghiệp. Rất hài lòng và sẽ giới thiệu cho bạn bè!" },
  { id: "r2", name: "Chị Trần Hồng Nhung", role: "Giám đốc Công ty TechViet", project: "🏢 Văn phòng 1.200m² · Quận 1", stars: 5, text: "Đội thợ rất chuyên nghiệp, đúng giờ and sạch sẽ. Báo giá minh bạch, không phát sinh. Văn phòng 1.200m² được hoàn thiện đúng theo bản vẽ thiết kế, chất lượng vượt kỳ vọng của ban lãnh đạo." },
  { id: "r3", name: "Anh Lê Minh Khoa", role: "Nhà thầu xây dựng, Bình Dương", project: "🏗️ Dự án 300 căn hộ · Vật liệu sỉ", stars: 5, text: "Mua vật liệu số lượng lớn cho dự án 300 căn hộ. Hàng đúng chủng loại, giao đúng hẹn, giá tốt hơn các đại lý khác. Dịch vụ hậu mãi cũng rất tốt. Sẽ tiếp tục hợp tác dài hạn." },
];

const SIMULATOR_ROOMS = [ "🛋️ Phòng Khách", "🛏️ Phòng Ngủ", "🍳 Phòng Ăn & Bếp", "🛀 Phòng Tắm", "🏢 Văn Phòng", "🍽️ Nhà Hàng", "☕ Quán Cafe", "🏨 Sảnh Khách Sạn", "🎤 Phòng Karaoke", "🛥️ Tàu Du Lịch", "🛍️ Showroom", "🏛️ Biệt Thự" ];

const compressImage = (file, maxWidth = 1200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve({ base64: compressedBase64, filename: file.name.replace(/\.[^/.]+$/, "") + ".jpg", mimeType: "image/jpeg" });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = window.atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const sanitizeFilename = (filename) => {
  return filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9.]/g, "_").replace(/_+/g, "_");
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ new_password: "", confirm_password: "" });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ id: "", title: "", category: "", location: "", size: "", image: "" });
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
  const [isSavingGallery, setIsSavingGallery] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ id: "", name: "", role: "", project: "", stars: 5, text: "", avatar: "" });
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [isSavingReview, setIsSavingReview] = useState(false);

  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({ id: "", brand: "", name: "", desc: "", tags: "", icon: "" });
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const [configs, setConfigs] = useState({
    brand_name: "ThạchCaoSố1",
    contact_phone: "0901 234 567",
    contact_zalo: "0901 234 567",
    contact_email: "thachpro@gmail.com",
    contact_address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    contact_map_url: "https://maps.google.com/?q=10.732498,106.717207",
    hero_tag: "Đang nhận dự án — TP.HCM & Bình Dương",
    hero_title: "Kiến Tạo<br>Không Gian<br><em>Hoàn Hảo</em>",
    hero_sub: "Đơn vị thi công thạch cao hàng đầu tại TP.HCM...",
    hero_btn1: "→ Nhận Báo Giá Miễn Phí",
    hero_btn2: "Xem Công Trình →",
    stat1_lbl: "Công trình hoàn thành",
    stat2_lbl: "Năm kinh nghiệm",
    stat3_lbl: "Khách hàng hài lòng",
    contact_hours: "Hotline 7:00–18:00",
    about_years: "15",
    about_title: "Hơn 15 Năm Xây Dựng Niềm Tin",
    about_desc: "ThạchCaoSố1 được thành lập lâu năm...",
    cta_title: "Bắt Đầu Dự Án<br/>Của Bạn Hôm Ngày",
    cta_desc: "Liên hệ ngay để được tư vấn...",
    cta_btn: "📞 Gọi Ngay: 0901 234 567",
    footer_desc: "Đơn vị thi công thạch cao...",
    color_primary: "#e8a020",
    color_secondary: "#f5c842",
    logo_image: "",
    favicon_image: "",
    seo_title: "Thạch Cao Số 1 - Thi Công Trần Thạch Cao TP.HCM",
    seo_desc: "Chuyên thi công trần thạch cao giật cấp, vách ngăn...",
    social_fb: "#",
    social_zalo: "#",
    social_yt: "#",
    social_tt: "#",
    svc_title: "Thi Công Toàn Diện",
    svc_subtitle: "Đúng Chất Lượng",
    svc_desc: "Đội thợ lành nghề 10+ năm kinh nghiệm...",
    map_iframe_url: "https://www.google.com/maps/embed?pb=...",
  });
  const [isSavingConfigs, setIsSavingConfigs] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [selectedFaviconFile, setSelectedFaviconFile] = useState(null);

  const [recruitmentList, setRecruitmentList] = useState([]);
  const [loadingRecruitment, setLoadingRecruitment] = useState(false);

  const [simulatorItems, setSimulatorItems] = useState([]);
  const [loadingSimulator, setLoadingSimulator] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [simulatorForm, setSimulatorForm] = useState({ id: "", room_name: "", image: "" });
  const [selectedSimulatorFiles, setSelectedSimulatorFiles] = useState([]);
  const [isSavingSimulator, setIsSavingSimulator] = useState(false);

  useEffect(() => { checkUserSession(); }, []);

  const checkUserSession = async () => {
    const loginTimeStr = localStorage.getItem("admin_login_time");
    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr);
      if (Date.now() - loginTime > 24 * 60 * 60 * 1000) {
        alert("Phiên làm việc đã hết hạn!"); await doLogout(); return;
      }
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { setIsAuthenticated(true); fetchData(); } else { setIsAuthenticated(false); }
  };

  const fetchData = () => { loadGallery(); loadReviews(); loadContacts(); loadMaterials(); loadConfigs(); loadRecruitment(); loadSimulator(); };

  const doLogin = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) { alert("Vui lòng nhập đầy đủ!"); return; }
    setIsLoggingIn(true); setLoginError(false);
    try {
      let formattedUser = emailInput.trim();
      if (!emailInput.includes("@") && formattedUser.startsWith("0")) formattedUser = "+84" + formattedUser.slice(1);
      const credentials = emailInput.includes("@") ? { email: formattedUser, password: passwordInput } : { phone: formattedUser, password: passwordInput };
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) { setLoginError(true); setPasswordInput(""); alert("Đăng nhập thất bại!"); }
      else { localStorage.setItem("admin_login_time", Date.now().toString()); setIsAuthenticated(true); fetchData(); }
    } catch (err) { alert("Lỗi kết nối!"); } finally { setIsLoggingIn(false); }
  };

  const doLogout = async () => { localStorage.removeItem("admin_login_time"); await supabase.auth.signOut(); setIsAuthenticated(false); };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) { alert("Mật khẩu không khớp!"); return; }
    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.new_password });
      if (error) throw error; alert("Thành công!"); setShowPasswordModal(false);
    } catch (err) { alert("Lỗi!"); } finally { setIsSavingPassword(false); }
  };

  const loadGallery = async () => { setLoadingGallery(true); const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false }); setGalleryItems(data || []); setLoadingGallery(false); };
  const handleFileChange = (e) => { if (e.target.files) setSelectedGalleryFiles(Array.from(e.target.files)); };
  const saveGallery = async (e) => {
    e.preventDefault(); setIsSavingGallery(true);
    try {
      const uploadedUrls = [];
      for (const file of selectedGalleryFiles) {
        const comp = await compressImage(file, 1200); const blob = base64ToBlob(comp.base64, "image/jpeg");
        const filePath = `gallery/${Date.now()}_${sanitizeFilename(comp.filename)}`;
        await supabase.storage.from("portfolio").upload(filePath, blob, { contentType: "image/jpeg" });
        uploadedUrls.push(supabase.storage.from("portfolio").getPublicUrl(filePath).data.publicUrl);
      }
      const finalImg = [...(galleryForm.image ? galleryForm.image.split("|") : []), ...uploadedUrls].join("|");
      await supabase.from("gallery").upsert({ ...galleryForm, id: galleryForm.id || "CT" + Date.now(), image: finalImg });
      setShowGalleryModal(false); loadGallery(); alert("Lưu thành công!");
    } catch (err) { alert("Lỗi!"); } finally { setIsSavingGallery(false); }
  };
  const handleDeleteSubImage = (index) => { const list = galleryForm.image.split("|").filter((_, i) => i !== index); setGalleryForm({ ...galleryForm, image: list.join("|") }); };
  const deleteGallery = async (id) => { if (window.confirm("Xóa?")) { await supabase.from("gallery").delete().eq("id", id); loadGallery(); } };

  const loadReviews = async () => { const { data } = await supabase.from("reviews").select("*"); setReviews(data || []); };
  const handleAvatarChange = (e) => { if (e.target.files?.[0]) setSelectedAvatarFile(e.target.files[0]); };
  const saveReview = async (e) => {
    e.preventDefault(); setIsSavingReview(true);
    try {
      let url = reviewForm.avatar;
      if (selectedAvatarFile) {
        const comp = await compressImage(selectedAvatarFile, 200); const blob = base64ToBlob(comp.base64, "image/jpeg");
        const path = `avatars/${Date.now()}_${sanitizeFilename(comp.filename)}`;
        await supabase.storage.from("portfolio").upload(path, blob);
        url = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
      }
      await supabase.from("reviews").upsert({ ...reviewForm, id: reviewForm.id || "RV" + Date.now(), avatar: url });
      setShowReviewModal(false); loadReviews();
    } catch (err) { alert("Lỗi!"); } finally { setIsSavingReview(false); }
  };
  const deleteReview = async (id) => { if (window.confirm("Xóa?")) { await supabase.from("reviews").delete().eq("id", id); loadReviews(); } };

  const loadMaterials = async () => { const { data } = await supabase.from("materials").select("*"); setMaterials(data || []); };
  const saveMaterial = async (e) => { e.preventDefault(); setIsSavingMaterial(true); await supabase.from("materials").upsert({ ...materialForm, id: materialForm.id || "MAT" + Date.now() }); setShowMaterialModal(false); loadMaterials(); setIsSavingMaterial(false); };
  const deleteMaterial = async (id) => { if (window.confirm("Xóa?")) { await supabase.from("materials").delete().eq("id", id); loadMaterials(); } };

  const loadContacts = async () => { const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false }); setContacts(data || []); };
  
  const loadConfigs = async () => {
    const { data } = await supabase.from("content").select("*");
    if (data) { const obj = { ...configs }; data.forEach(i => obj[i.key] = i.value); setConfigs(obj); }
  };

  const handleLogoFileChange = (e) => { if (e.target.files?.[0]) setSelectedLogoFile(e.target.files[0]); };
  const handleFaviconFileChange = (e) => { if (e.target.files?.[0]) setSelectedFaviconFile(e.target.files[0]); };

  const saveConfigs = async (e) => {
    e.preventDefault(); setIsSavingConfigs(true);
    try {
      let logoUrl = configs.logo_image;
      let faviconUrl = configs.favicon_image;

      if (selectedLogoFile) {
        const comp = await compressImage(selectedLogoFile, 300); const blob = base64ToBlob(comp.base64, "image/png");
        const path = `logo/${Date.now()}_logo.png`;
        await supabase.storage.from("portfolio").upload(path, blob);
        logoUrl = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
      }

      if (selectedFaviconFile) {
        const comp = await compressImage(selectedFaviconFile, 64); const blob = base64ToBlob(comp.base64, "image/png");
        const path = `logo/${Date.now()}_favicon.png`;
        await supabase.storage.from("portfolio").upload(path, blob);
        faviconUrl = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
      }

      const updated = { ...configs, logo_image: logoUrl, favicon_image: faviconUrl };
      const promises = Object.keys(updated).map(k => supabase.from("content").upsert({ key: k, value: updated[k] }));
      await Promise.all(promises); alert("Lưu cấu hình thành công!"); loadConfigs();
    } catch (err) { alert("Lỗi!"); } finally { setIsSavingConfigs(false); }
  };

  const loadRecruitment = async () => { const { data } = await supabase.from("recruitment").select("*").order("created_at", { ascending: false }); setRecruitmentList(data || []); };
  const deleteRecruit = async (id) => { if (window.confirm("Xóa?")) { await supabase.from("recruitment").delete().eq("id", id); loadRecruitment(); } };

  const loadSimulator = async () => { const { data } = await supabase.from("simulator").select("*"); setSimulatorItems(data || []); };
  const handleSimulatorFileChange = (e) => { if (e.target.files) setSelectedSimulatorFiles(Array.from(e.target.files)); };
  const saveSimulator = async (e) => {
    e.preventDefault(); setIsSavingSimulator(true);
    try {
      const urls = [];
      for (const file of selectedSimulatorFiles) {
        const comp = await compressImage(file, 1200); const blob = base64ToBlob(comp.base64, "image/jpeg");
        const path = `simulator/${Date.now()}_${sanitizeFilename(comp.filename)}`;
        await supabase.storage.from("portfolio").upload(path, blob);
        urls.push(supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl);
      }
      const final = [...(simulatorForm.image ? simulatorForm.image.split("|") : []), ...urls].join("|");
      await supabase.from("simulator").upsert({ ...simulatorForm, id: simulatorForm.id || sanitizeFilename(simulatorForm.room_name), image: final });
      setShowSimulatorModal(false); loadSimulator();
    } catch (err) { alert("Lỗi!"); } finally { setIsSavingSimulator(false); }
  };
  const handleDeleteSimSubImage = (index) => { const list = simulatorForm.image.split("|").filter((_, i) => i !== index); setSimulatorForm({ ...simulatorForm, image: list.join("|") }); };
  const deleteSimulator = async (id) => { if (window.confirm("Xóa?")) { await supabase.from("simulator").delete().eq("id", id); loadSimulator(); } };

  const renderContactNote = (note) => {
    if (!note) return "—"; const urlRegex = /(https?:\/\/[^\s]+)/g; const matches = note.match(urlRegex);
    if (matches) {
      const url = matches[0];
      return (<div>{note.replace(url, "")}<div style={{ marginTop: "0.5rem" }}><a href={url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>🖼️ Xem ảnh mẫu</a><img src={url} alt="" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "4px", display: "block", marginTop: "0.3rem", border: "1px solid var(--line)" }} /></div></div>);
    }
    return note;
  };

  if (!isAuthenticated) {
    return (
      <div id="login-screen">
        <div className="login-box">
          <div className="login-logo">🏠</div>
          <div className="login-title">Thạch<span>Pro</span> Admin</div>
          <div className="login-sub">Nhập tài khoản để tiếp tục</div>
          <input className="login-input" type="text" placeholder="Email hoặc SĐT" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} disabled={isLoggingIn} />
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input className="login-input" type={showPassword ? "text" : "password"} placeholder="••••••••" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doLogin()} disabled={isLoggingIn} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>{showPassword ? "👁️" : "🙈"}</button>
          </div>
          <button className="login-btn" onClick={doLogin} disabled={isLoggingIn}>{isLoggingIn ? "⏳ Đang xác thực..." : "🔐 Đăng Nhập"}</button>
          {loginError && <div className="login-error" style={{ marginTop: "1rem" }}>❌ Sai thông tin!</div>}
        </div>
      </div>
    );
  }

  return (
    <div id="main" style={{ display: "block" }}>
      <style>{`:root { --accent: ${configs.color_primary || "#e8a020"} !important; --accent2: ${configs.color_secondary || "#f5c842"} !important; }`}</style>
      <div className="topbar">
        <div className="topbar-logo"><div className="topbar-icon">🏠</div><div className="topbar-name">{configs.brand_name || "ThạchCaoSố1"} <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: ".85rem" }}>/ Admin Panel</span></div></div>
        <div className="topbar-right"><button className="view-btn" onClick={() => setShowPasswordModal(true)}>🔑 Đổi Mật Khẩu</button><button className="logout-btn" onClick={doLogout}>Đăng Xuất</button></div>
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === "gallery" ? "active" : ""}`} onClick={() => setActiveTab("gallery")}>🖼️ Công Trình</div>
        <div className={`tab ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>⭐ Đánh Giá</div>
        <div className={`tab ${activeTab === "materials" ? "active" : ""}`} onClick={() => setActiveTab("materials")}>⚙️ Vật Liệu</div>
        <div className={`tab ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>📋 Khách Hàng</div>
        <div className={`tab ${activeTab === "simulator" ? "active" : ""}`} onClick={() => setActiveTab("simulator")}>🎮 Giả Lập 3D</div>
        <div className={`tab ${activeTab === "configs" ? "active" : ""}`} onClick={() => setActiveTab("configs")}>🛠️ Cấu Hình Trang</div>
        <div className={`tab ${activeTab === "recruitment" ? "active" : ""}`} onClick={() => setActiveTab("recruitment")}>💼 Tuyển Dụng</div>
      </div>

      <div className="content">
        {activeTab === "gallery" && (
          <div>
            <div className="section-header"><h2>🖼️ Quản Lý Công Trình</h2><button className="add-btn" onClick={() => { setGalleryForm({ id: "", title: "", category: "Trần thạch cao phòng khách", location: "", size: "", image: "" }); setSelectedGalleryFiles([]); setShowGalleryModal(true); }}>+ Thêm Mới</button></div>
            <table className="admin-table">
              <thead><tr><th>Ảnh</th><th>Tiêu đề</th><th>Danh mục</th><th>Thao tác</th></tr></thead>
              <tbody>{galleryItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.image && <img src={item.image.split("|")[0]} alt="" style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "4px" }} />}</td>
                  <td><strong>{item.title}</strong></td>
                  <td><span className="badge">{item.category}</span></td>
                  <td><button className="edit-sub-btn" onClick={() => { setGalleryForm(item); setShowGalleryModal(true); }}>Sửa</button><button className="delete-sub-btn" onClick={() => deleteGallery(item.id)}>Xóa</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="section-header"><h2>⭐ Đánh Giá Khách Hàng</h2><button className="add-btn" onClick={() => { setReviewForm({ id: "", name: "", role: "", project: "", stars: 5, text: "", avatar: "" }); setShowReviewModal(true); }}>+ Thêm Mới</button></div>
            <table className="admin-table">
              <thead><tr><th>Avatar</th><th>Họ Tên</th><th>Dự Án</th><th>Nội dung</th><th>Thao tác</th></tr></thead>
              <tbody>{reviews.map((r) => (
                <tr key={r.id}>
                  <td><img src={r.avatar || "https://via.placeholder.com/40"} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} /></td>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.project}</td>
                  <td style={{ maxWidth: "300px" }}>{r.text}</td>
                  <td><button className="edit-sub-btn" onClick={() => { setReviewForm(r); setShowReviewModal(true); }}>Sửa</button><button className="delete-sub-btn" onClick={() => deleteReview(r.id)}>Xóa</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === "materials" && (
          <div>
            <div className="section-header"><h2>⚙️ Danh Mục Vật Liệu</h2><button className="add-btn" onClick={() => { setMaterialForm({ id: "", brand: "", name: "", desc: "", tags: "", icon: "🧱" }); setShowMaterialModal(true); }}>+ Thêm Mới</button></div>
            <table className="admin-table">
              <thead><tr><th>Icon</th><th>Thương hiệu</th><th>Tên</th><th>Thao tác</th></tr></thead>
              <tbody>{materials.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontSize: "1.5rem" }}>{m.icon}</td>
                  <td><div style={{ color: "var(--accent)", fontWeight: "bold" }}>{m.brand}</div></td>
                  <td><strong>{m.name}</strong></td>
                  <td><button className="edit-sub-btn" onClick={() => { setMaterialForm(m); setShowMaterialModal(true); }}>Sửa</button><button className="delete-sub-btn" onClick={() => deleteMaterial(m.id)}>Xóa</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === "contacts" && (
          <div>
            <h2>📋 Khách Hàng Liên Hệ</h2>
            <table className="admin-table">
              <thead><tr><th>Ngày Gửi</th><th>Khách Hàng</th><th>Dịch Vụ</th><th>Ghi Chú</th></tr></thead>
              <tbody>{contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.created_at ? new Date(c.created_at).toLocaleString() : "—"}</td>
                  <td><strong>{c.name}</strong><div>📞 <a href={`tel:${c.phone}`}>{c.phone}</a></div></td>
                  <td><span className="badge">{c.service || "Tư vấn"}</span></td>
                  <td>{renderContactNote(c.note)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === "simulator" && (
          <div>
            <div className="section-header"><h2>🎮 Giả Lập Không Gian 3D</h2><button className="add-btn" onClick={() => { setSimulatorForm({ id: "", room_name: SIMULATOR_ROOMS[0], image: "" }); setShowSimulatorModal(true); }}>+ Cấu Hình Phòng</button></div>
            <table className="admin-table">
              <thead><tr><th>Phòng</th><th>Ảnh</th><th>Thao tác</th></tr></thead>
              <tbody>{simulatorItems.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.room_name}</strong></td>
                  <td><span className="badge">{(s.image || "").split("|").filter(Boolean).length} Ảnh</span></td>
                  <td><button className="edit-sub-btn" onClick={() => { setSimulatorForm(s); setShowSimulatorModal(true); }}>Sửa</button><button className="delete-sub-btn" onClick={() => deleteSimulator(s.id)}>Xóa</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === "configs" && (
          <div>
            <div className="section-header">
              <h2>🛠️ Cấu Hình Chi Tiết Website</h2>
              <button onClick={saveConfigs} className="add-btn" disabled={isSavingConfigs}>
                {isSavingConfigs ? "⏳ Đang Lưu..." : "💾 Lưu Tất Cả Thay Đổi"}
              </button>
            </div>
            
            <form onSubmit={saveConfigs} className="admin-form-box" style={{ maxWidth: "100%" }}>
              {/* GROUP 1: CHUNG & NHẬN DIỆN */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem" }}>
                <h3 style={{ color: "var(--accent)", marginTop: 0 }}>🏠 NHẬN DIỆN THƯƠNG HIỆU</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                  <div>
                    <label>Tên Thương Hiệu</label>
                    <input type="text" value={configs.brand_name} onChange={(e) => setConfigs({ ...configs, brand_name: e.target.value })} />
                  </div>
                  <div>
                    <label>Logo Website (PNG)</label>
                    <input type="file" accept="image/*" onChange={handleLogoFileChange} />
                    {configs.logo_image && <img src={configs.logo_image} alt="" style={{ height: "40px", marginTop: "10px", borderRadius: "4px" }} />}
                  </div>
                  <div>
                    <label>Favicon Website (ICO/PNG)</label>
                    <input type="file" accept="image/*" onChange={handleFaviconFileChange} />
                    {configs.favicon_image && <img src={configs.favicon_image} alt="" style={{ height: "32px", marginTop: "10px" }} />}
                  </div>
                  <div><label>Màu Chủ Đạo</label><input type="color" value={configs.color_primary} onChange={(e) => setConfigs({ ...configs, color_primary: e.target.value })} style={{ height: "45px" }} /></div>
                  <div><label>Màu Phụ</label><input type="color" value={configs.color_secondary} onChange={(e) => setConfigs({ ...configs, color_secondary: e.target.value })} style={{ height: "45px" }} /></div>
                  <div><label>Năm Kinh Nghiệm</label><input type="text" value={configs.about_years} onChange={(e) => setConfigs({ ...configs, about_years: e.target.value })} /></div>
                </div>
              </div>

              {/* GROUP 2: HERO BANNER */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem" }}>
                <h3 style={{ color: "var(--accent)", marginTop: 0 }}>🚩 HERO BANNER (ĐẦU TRANG)</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label>Tiêu đề chính (Chấp nhận thẻ &lt;br&gt;, &lt;em&gt;)</label>
                    <input type="text" value={configs.hero_title} onChange={(e) => setConfigs({ ...configs, hero_title: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label>Mô tả ngắn Hero</label>
                    <textarea rows={2} value={configs.hero_sub} onChange={(e) => setConfigs({ ...configs, hero_sub: e.target.value })} />
                  </div>
                  <div><label>Nút 1 (Báo giá)</label><input type="text" value={configs.hero_btn1} onChange={(e) => setConfigs({ ...configs, hero_btn1: e.target.value })} /></div>
                  <div><label>Nút 2 (Công trình)</label><input type="text" value={configs.hero_btn2} onChange={(e) => setConfigs({ ...configs, hero_btn2: e.target.value })} /></div>
                </div>
              </div>

              {/* GROUP 3: GIỚI THIỆU & DỊCH VỤ */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem" }}>
                <h3 style={{ color: "var(--accent)", marginTop: 0 }}>📖 GIỚI THIỆU & DỊCH VỤ</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div><label>Tiêu đề Về Chúng Tôi</label><input type="text" value={configs.about_title} onChange={(e) => setConfigs({ ...configs, about_title: e.target.value })} /></div>
                  <div><label>Tiêu đề Dịch Vụ</label><input type="text" value={configs.svc_title} onChange={(e) => setConfigs({ ...configs, svc_title: e.target.value })} /></div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label>Mô tả chi tiết Về Chúng Tôi</label>
                    <textarea rows={3} value={configs.about_desc} onChange={(e) => setConfigs({ ...configs, about_desc: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* GROUP 4: THÔNG TIN LIÊN HỆ & GOOGLE MAPS */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem" }}>
                <h3 style={{ color: "var(--accent)", marginTop: 0 }}>📞 THÔNG TIN LIÊN HỆ & BẢN ĐỒ</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                  <div><label>Hotline</label><input type="text" value={configs.contact_phone} onChange={(e) => setConfigs({ ...configs, contact_phone: e.target.value })} /></div>
                  <div><label>Zalo</label><input type="text" value={configs.contact_zalo} onChange={(e) => setConfigs({ ...configs, contact_zalo: e.target.value })} /></div>
                  <div><label>Email</label><input type="text" value={configs.contact_email} onChange={(e) => setConfigs({ ...configs, contact_email: e.target.value })} /></div>
                  <div><label>Giờ làm việc</label><input type="text" value={configs.contact_hours} onChange={(e) => setConfigs({ ...configs, contact_hours: e.target.value })} /></div>
                  <div style={{ gridColumn: "span 2" }}><label>Địa chỉ văn phòng</label><input type="text" value={configs.contact_address} onChange={(e) => setConfigs({ ...configs, contact_address: e.target.value })} /></div>
                  <div style={{ gridColumn: "span 2" }}><label>Link Google Maps (Nhấp để mở)</label><input type="text" value={configs.contact_map_url} onChange={(e) => setConfigs({ ...configs, contact_map_url: e.target.value })} /></div>
                  <div style={{ gridColumn: "span 2" }}><label>Mã nhúng Iframe Maps (Dùng cho bản đồ hiển thị trên web)</label><textarea rows={2} value={configs.map_iframe_url} onChange={(e) => setConfigs({ ...configs, map_iframe_url: e.target.value })} /></div>
                </div>
              </div>

              {/* GROUP 5: SEO & SOCIAL MEDIA */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "10px" }}>
                <h3 style={{ color: "var(--accent)", marginTop: 0 }}>🔍 SEO & MẠNG XÃ HỘI</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div><label>SEO Title (Tiêu đề trên Google)</label><input type="text" value={configs.seo_title} onChange={(e) => setConfigs({ ...configs, seo_title: e.target.value })} /></div>
                  <div><label>Link Facebook</label><input type="text" value={configs.social_fb} onChange={(e) => setConfigs({ ...configs, social_fb: e.target.value })} /></div>
                  <div style={{ gridColumn: "span 2" }}><label>SEO Description (Mô tả trên Google)</label><textarea rows={2} value={configs.seo_desc} onChange={(e) => setConfigs({ ...configs, seo_desc: e.target.value })} /></div>
                  <div><label>Link YouTube</label><input type="text" value={configs.social_yt} onChange={(e) => setConfigs({ ...configs, social_yt: e.target.value })} /></div>
                  <div><label>Link TikTok</label><input type="text" value={configs.social_tt} onChange={(e) => setConfigs({ ...configs, social_tt: e.target.value })} /></div>
                </div>
              </div>
            </form>
          </div>
        )}

        {activeTab === "recruitment" && (
          <div>
            <h2>💼 Hồ Sơ Ứng Tuyển Tuyển Dụng</h2>
            <table className="admin-table">
              <thead><tr><th>Ngày</th><th>Thông tin thợ</th><th>Vị trí</th><th>Kinh nghiệm</th><th>Thao tác</th></tr></thead>
              <tbody>{recruitmentList.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td><strong>{r.name}</strong><div>📞 {r.phone}</div></td>
                  <td><span className="badge" style={{ background: "#4caf50", color: "#fff" }}>{r.position}</span></td>
                  <td>{r.experience}</td>
                  <td><button className="delete-sub-btn" onClick={() => deleteRecruit(r.id)}>Xóa</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CÁC MODAL GIỮ NGUYÊN NHƯ FILE CŨ --- */}
      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>🔑 Đổi Mật Khẩu Admin</h3>
            <form onSubmit={handleChangePassword}>
              <label>Mật khẩu mới</label><input type="password" required value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} />
              <label>Xác nhận mật khẩu</label><input type="password" required value={passwordForm.confirm_password} onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })} />
              <div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setShowPasswordModal(false)}>Hủy</button><button type="submit" className="save-btn" disabled={isSavingPassword}>{isSavingPassword ? "..." : "Cập Nhật"}</button></div>
            </form>
          </div>
        </div>
      )}

      {showGalleryModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>🖼️ {galleryForm.id ? "Sửa" : "Thêm"} Công Trình</h3>
            <form onSubmit={saveGallery}>
              <label>Tiêu đề</label><input type="text" required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} />
              <label>Hạng mục</label>
              <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}>
                <option value="Trần thạch cao phòng khách">Trần phòng khách</option>
                <option value="Trần thạch cao phòng ngủ">Trần phòng ngủ</option>
                <option value="Vách ngăn thạch cao">Vách ngăn</option>
                <option value="Trần thả văn phòng">Trần thả</option>
              </select>
              <label>Ảnh công trình (Chọn nhiều)</label><input type="file" multiple onChange={handleFileChange} />
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "10px" }}>
                {(galleryForm.image || "").split("|").filter(Boolean).map((img, idx) => (
                  <div key={idx} style={{ position: "relative" }}><img src={img} alt="" style={{ width: "50px", height: "50px", objectFit: "cover" }} /><button type="button" onClick={() => handleDeleteSubImage(idx)} style={{ position: "absolute", top: 0, right: 0, background: "red", color: "white", border: "none", fontSize: "10px" }}>x</button></div>
                ))}
              </div>
              <div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setShowGalleryModal(false)}>Hủy</button><button type="submit" className="save-btn" disabled={isSavingGallery}>{isSavingGallery ? "Đang tải..." : "Lưu"}</button></div>
            </form>
          </div>
        </div>
      )}

      {showSimulatorModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>🎮 Cấu Hình Giả Lập 3D</h3>
            <form onSubmit={saveSimulator}>
              <label>Chọn Không Gian</label>
              <select value={simulatorForm.room_name} onChange={(e) => setSimulatorForm({ ...simulatorForm, room_name: e.target.value })} disabled={!!simulatorForm.id}>
                {SIMULATOR_ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <label>Tải ảnh góc nhìn</label><input type="file" multiple onChange={handleSimulatorFileChange} />
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "10px" }}>
                {(simulatorForm.image || "").split("|").filter(Boolean).map((img, idx) => (
                  <div key={idx} style={{ position: "relative" }}><img src={img} alt="" style={{ width: "50px", height: "50px", objectFit: "cover" }} /><button type="button" onClick={() => handleDeleteSimSubImage(idx)} style={{ position: "absolute", top: 0, right: 0, background: "red", color: "white", border: "none", fontSize: "10px" }}>x</button></div>
                ))}
              </div>
              <div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setShowSimulatorModal(false)}>Hủy</button><button type="submit" className="save-btn" disabled={isSavingSimulator}>{isSavingSimulator ? "..." : "Lưu"}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REVIEW & MATERIAL giữ nguyên logic tương tự */}
      {showReviewModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>⭐ {reviewForm.id ? "Sửa" : "Thêm"} Đánh Giá</h3>
            <form onSubmit={saveReview}>
              <label>Họ tên</label><input type="text" required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} />
              <label>Dự án</label><input type="text" value={reviewForm.project} onChange={(e) => setReviewForm({ ...reviewForm, project: e.target.value })} />
              <label>Nội dung</label><textarea rows={3} required value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} />
              <label>Ảnh Avatar</label><input type="file" onChange={handleAvatarChange} />
              <div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setShowReviewModal(false)}>Hủy</button><button type="submit" className="save-btn">Lưu</button></div>
            </form>
          </div>
        </div>
      )}

      {showMaterialModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>⚙️ {materialForm.id ? "Sửa" : "Thêm"} Vật Liệu</h3>
            <form onSubmit={saveMaterial}>
              <label>Thương hiệu</label><input type="text" required value={materialForm.brand} onChange={(e) => setMaterialForm({ ...materialForm, brand: e.target.value })} />
              <label>Tên vật liệu</label><input type="text" required value={materialForm.name} onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })} />
              <label>Icon</label><input type="text" value={materialForm.icon} onChange={(e) => setMaterialForm({ ...materialForm, icon: e.target.value })} />
              <label>Thẻ (Ngăn cách bằng |)</label><input type="text" value={materialForm.tags} onChange={(e) => setMaterialForm({ ...materialForm, tags: e.target.value })} />
              <label>Mô tả</label><textarea rows={2} value={materialForm.desc} onChange={(e) => setMaterialForm({ ...materialForm, desc: e.target.value })} />
              <div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setShowMaterialModal(false)}>Hủy</button><button type="submit" className="save-btn">Lưu</button></div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}