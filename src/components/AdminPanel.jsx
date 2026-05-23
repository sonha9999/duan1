// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "../AdminPanel.css";

const DEFAULT_MATERIALS = [
  {
    id: "m1",
    brand: "Knauf · USG · Vĩnh Tường",
    name: "Tấm Thạch Cao Tiêu Chuẩn",
    desc: "Tấm 9mm, 12mm, 15mm. Dùng cho trần phẳng, trần thả, vách ngăn thông thường.",
    tags: "9.5mm|12mm|15mm",
    icon: "🧱",
  },
  {
    id: "m2",
    brand: "Knauf Aquapanel",
    name: "Tấm Thạch Cao Chống Ẩm",
    desc: "Lõi thạch cao phụ gia chống ẩm đặc biệt. Dùng cho phòng tắm, bếp, khu vực ẩm ướt.",
    tags: "Chống Ẩm|12mm|Xanh Lá",
    icon: "💧",
  },
  {
    id: "m3",
    brand: "USG Sheetrock",
    name: "Tấm Thạch Cao Chống Cháy",
    desc: "Lõi chứa Micro Silica & sợi thủy tinh. Đạt tiêu chuẩn chống cháy PCCC quốc tế.",
    tags: "Chống Cháy|REI 60",
    icon: "🔥",
  },
  {
    id: "m4",
    brand: "Vĩnh Tường · Gyproc",
    name: "Khung Thép Mạ Kẽm",
    desc: "Thanh C, U, V mạ kẽm nhúng nóng dày 0.45–0.55mm. Chống gỉ, bền 30 năm.",
    tags: "Thanh C|Thanh U|Mạ Kẽm",
    icon: "🔩",
  },
  {
    id: "m5",
    brand: "Rockwool · Isover",
    name: "Bông Khoáng Cách Nhiệt",
    desc: "Bông khoáng mật độ cao. Cách nhiệt & cách âm vượt trội, không cháy lan.",
    tags: "Cách Âm|Cách Nhiệt",
    icon: "🌡️",
  },
  {
    id: "m6",
    brand: "Dulux · Jotun · Kova",
    name: "Bột Bả & Sơn Nước",
    desc: "Bột trét Matit, Sika. Sơn nội ngoại thất cao cấp. Đủ màu theo NCS, RAL, Pantone.",
    tags: "Nội Thất|Ngoại Thất",
    icon: "🎨",
  },
  {
    id: "m7",
    brand: "Hilti · Fischer · Knauf",
    name: "Phụ Kiện Thi Công",
    desc: "Vít, băng lưới, hợp chất trám khe, kẹp trần, ty treo, nẹp góc inox chuyên dụng.",
    tags: "Vít|Băng Lưới|Nẹp Góc",
    icon: "🔧",
  },
  {
    id: "m8",
    brand: "Giao Hàng Toàn TP.HCM",
    name: "Mua Sỉ & Lẻ",
    desc: "Giá sỉ ưu đãi từ 100m². Giao hàng trong ngày tại TP.HCM, Bình Dương, Long An.",
    tags: "Trong Ngày|Giá Sỉ|COD",
    icon: "🚚",
  },
];

const DEFAULT_REVIEWS = [
  {
    id: "r1",
    name: "Anh Nguyễn Văn Tuấn",
    role: "Chủ hộ Vinhomes Grand Park",
    project: "🏠 Căn hộ 450m² · Trần giật cấp",
    stars: 5,
    text: "ThạchPro hoàn thành toàn bộ trần giật cấp và vách ngăn penthouse 450m² chỉ trong 10 ngày. Bề mặt cực kỳ mịn, đường nét sắc sảo, đội thợ sạch sẽ and chuyên nghiệp. Rất hài lòng và sẽ giới thiệu cho bạn bè!",
  },
  {
    id: "r2",
    name: "Chị Trần Hồng Nhung",
    role: "Giám đốc Công ty TechViet",
    project: "🏢 Văn phòng 1.200m² · Quận 1",
    stars: 5,
    text: "Đội thợ rất chuyên nghiệp, đúng giờ and sạch sẽ. Báo giá minh bạch, không phát sinh. Văn phòng 1.200m² được hoàn thiện đúng theo bản vẽ thiết kế, chất lượng vượt kỳ vọng của ban lãnh đạo.",
  },
  {
    id: "r3",
    name: "Anh Lê Minh Khoa",
    role: "Nhà thầu xây dựng, Bình Dương",
    project: "🏗️ Dự án 300 căn hộ · Vật liệu sỉ",
    stars: 5,
    text: "Mua vật liệu số lượng lớn cho dự án 300 căn hộ. Hàng đúng chủng loại, giao đúng hẹn, giá tốt hơn các đại lý khác. Dịch vụ hậu mãi cũng rất tốt. Sẽ tiếp tục hợp tác dài hạn.",
  },
];

const SIMULATOR_ROOMS = [
  "🛋️ Phòng Khách",
  "🛏️ Phòng Ngủ",
  "🍳 Phòng Ăn & Bếp",
  "🛀 Phòng Tắm",
  "🏢 Văn Phòng",
  "🍽️ Nhà Hàng",
  "☕ Quán Cafe",
  "🏨 Sảnh Khách Sạn",
  "🎤 Phòng Karaoke",
  "🛥️ Tàu Du Lịch",
  "🛍️ Showroom",
  "🏛️ Biệt Thự",
];

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
        resolve({
          base64: compressedBase64,
          filename: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
          mimeType: "image/jpeg",
        });
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
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9.]/g, "_")
    .replace(/_+/g, "_");
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState(""); 
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");

  // Đổi mật khẩu
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Quản lý Gallery (Công trình)
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    id: "",
    title: "",
    category: "",
    location: "",
    size: "",
    image: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSavingGallery, setIsSavingGallery] = useState(false);

  // Quản lý Đánh giá (Reviews)
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    id: "",
    name: "",
    role: "",
    project: "",
    stars: 5,
    text: "",
    avatar: "",
  });
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [isSavingReview, setIsSavingReview] = useState(false);

  // Quản lý Vật Liệu (Materials)
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    id: "",
    brand: "",
    name: "",
    desc: "",
    tags: "",
    icon: "",
  });
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  // Khách hàng liên hệ
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Cấu hình chữ trang chủ (Content Editor)
  const [configs, setConfigs] = useState({
    brand_name: "ThạchPro",
    contact_phone: "0901 234 567",
    contact_zalo: "0901 234 567",
    contact_email: "thachpro@gmail.com",
    contact_address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    contact_map_url: "https://maps.google.com/?q=10.732498,106.717207",
    hero_tag: "Đang nhận dự án — TP.HCM & Bình Dương",
    hero_title: "Kiến Tạo<br>Không Gian<br><em>Hoàn Hảo</em>",
    hero_sub: "Đơn vị thi công thạch cao hàng đầu tại TP.HCM — trần giật cấp, vách ngăn, phào chỉ trang trí. Cung cấp vật liệu xây dựng cao cấp Knauf, USG chính hãng, giao tận công trình.",
    hero_btn1: "→ Nhận Báo Giá Miễn Phí",
    hero_btn2: "Xem Công Trình →",
    stat1_lbl: "Công trình hoàn thành",
    stat2_lbl: "Năm kinh nghiệm",
    stat3_lbl: "Khách hàng hài lòng",
    contact_hours: "Hotline 7:00–18:00",
    about_title: "Hơn 15 Năm Xây Dựng Niềm Tin",
    about_desc: "ThạchPro được thành lập lâu năm, đã hoàn thiện hơn 500 công trình từ căn hộ cao cấp, biệt thự, văn phòng đến trung tâm thương mại trên toàn TP.HCM.",
    cta_title: "Bắt Đầu Dự Án<br/>Của Bạn Hôm Ngày",
    cta_desc: "Liên hệ ngay để được tư vấn miễn phí và nhận báo giá trong 24 giờ. Đội ngũ ThạchPro luôn sẵn sàng biến ý tưởng của bạn thành hiện thực.",
    cta_btn: "📞 Gọi Ngay: 0901 234 567",
    footer_desc: "Đơn vị thi công thạch cao và cung cấp vật liệu xây dựng chuyên nghiệp tại TP.HCM từ năm 2008.",
    color_primary: "#e8a020",
    color_secondary: "#f5c842",
    logo_image: "",
  });
  const [isSavingConfigs, setIsSavingConfigs] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);

  // Danh sách hồ sơ ứng tuyển tuyển dụng (Recruitment)
  const [recruitmentList, setRecruitmentList] = useState([]);
  const [loadingRecruitment, setLoadingRecruitment] = useState(false);

  // NÂNG CẤP: States quản lý dữ liệu GIẢ LẬP 3D (Simulator)
  const [simulatorItems, setSimulatorItems] = useState([]);
  const [loadingSimulator, setLoadingSimulator] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [simulatorForm, setSimulatorForm] = useState({
    id: "",
    room_name: "",
    image: "",
  });
  const [isSavingSimulator, setIsSavingSimulator] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
      fetchData();
    }
  };

  const fetchData = () => {
    loadGallery();
    loadReviews();
    loadContacts();
    loadMaterials();
    loadConfigs();
    loadRecruitment();
    loadSimulator();
  };

  const doLogin = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) return;
    setIsLoggingIn(true);
    setLoginError(false);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });
      if (error) {
        setLoginError(true);
        setPasswordInput("");
      } else {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch {
      alert("Lỗi kết nối tới máy chủ Supabase.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const doLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.new_password || !passwordForm.confirm_password) {
      alert("Vui lòng điền đầy đủ thông tin mật khẩu!");
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!");
      return;
    }
    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password,
      });
      if (error) throw error;
      alert("Đổi mật khẩu thành công!");
      setShowPasswordModal(false);
      setPasswordForm({ new_password: "", confirm_password: "" });
    } catch (err) {
      alert(`Đổi mật khẩu thất bại: ${err.message || err}`);
    } finally {
      setIsSavingPassword(false);
    }
  };

  // CRUD Gallery
  const loadGallery = async () => {
    setLoadingGallery(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setGalleryItems(data || []);
    } catch {
      alert("Lỗi tải danh mục công trình.");
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const saveGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.category) {
      alert("Nhập đầy đủ tiêu đề và danh mục!");
      return;
    }
    setIsSavingGallery(true);
    try {
      const uploadedUrls = [];
      for (const file of selectedFiles) {
        const comp = await compressImage(file, 1200);
        const blob = base64ToBlob(comp.base64, "image/jpeg");
        const cleanName = sanitizeFilename(comp.filename);
        const filePath = `gallery/${Date.now()}_${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, blob, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const currentImagesList = galleryForm.image ? galleryForm.image.split("|").filter(Boolean) : [];
      const finalImageString = [...currentImagesList, ...uploadedUrls].join("|");

      const { error } = await supabase.from("gallery").upsert({
        id: galleryForm.id || "CT" + Date.now(),
        title: galleryForm.title,
        category: galleryForm.category,
        location: galleryForm.location,
        size: galleryForm.size,
        image: finalImageString,
      });

      if (error) throw error;

      setShowGalleryModal(false);
      setSelectedFiles([]);
      loadGallery();
      alert("Lưu công trình thành công!");
    } catch (err) {
      console.error("Lỗi chi tiết tải ảnh:", err);
      alert(`Lỗi tải ảnh: ${err.message || err}`);
    } finally {
      setIsSavingGallery(false);
    }
  };

  const handleDeleteSubImage = (indexToDelete) => {
    const currentImagesList = galleryForm.image ? galleryForm.image.split("|").filter(Boolean) : [];
    const updatedList = currentImagesList.filter((_, idx) => idx !== indexToDelete);
    setGalleryForm({
      ...galleryForm,
      image: updatedList.join("|"),
    });
  };

  const deleteGallery = async (id) => {
    if (window.confirm("Chắc chắn xóa công trình này?")) {
      await supabase.from("gallery").delete().eq("id", id);
      loadGallery();
    }
  };

  // CRUD Reviews
  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const { data } = await supabase.from("reviews").select("*");
      const dbReviews = data || [];
      const combined = DEFAULT_REVIEWS.map(def => {
        const edited = dbReviews.find(db => db.id === def.id);
        return edited ? edited : def;
      });
      const newlyAdded = dbReviews.filter(db => !DEFAULT_REVIEWS.some(def => def.id === db.id));
      setReviews([...combined, ...newlyAdded]);
    } catch {
      console.warn("Lỗi tải đánh giá.");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedAvatarFile(e.target.files[0]);
    }
  };

  const saveReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return;
    setIsSavingReview(true);
    try {
      let avatarUrl = reviewForm.avatar || "";

      if (selectedAvatarFile) {
        const comp = await compressImage(selectedAvatarFile, 200);
        const blob = base64ToBlob(comp.base64, "image/jpeg");
        const cleanName = sanitizeFilename(comp.filename);
        const filePath = `avatars/${Date.now()}_${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, blob, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const finalId = reviewForm.id || "RV" + Date.now();
      
      await supabase.from("reviews").upsert({
        ...reviewForm,
        id: finalId, 
        avatar: avatarUrl,
      });

      setShowReviewModal(false);
      setSelectedAvatarFile(null);
      loadReviews();
      alert("Lưu đánh giá thành công!");
    } catch (error) {
      alert("Lưu đánh giá lỗi.");
    } finally {
      setIsSavingReview(false);
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm("Xóa đánh giá này?")) {
      await supabase.from("reviews").delete().eq("id", id);
      loadReviews();
    }
  };

  // CRUD Materials
  const loadMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const { data } = await supabase.from("materials").select("*");
      const dbMaterials = data || [];
      const combined = DEFAULT_MATERIALS.map(def => {
        const edited = dbMaterials.find(db => db.id === def.id);
        return edited ? edited : def;
      });
      const newlyAdded = dbMaterials.filter(db => !DEFAULT_MATERIALS.some(def => def.id === db.id));
      setMaterials([...combined, ...newlyAdded]);
    } catch {
      console.warn("Lỗi tải vật liệu.");
    } finally {
      setLoadingMaterials(false);
    }
  };

  const saveMaterial = async (e) => {
    e.preventDefault();
    if (!materialForm.name || !materialForm.brand) {
      alert("Vui lòng nhập tên và thương hiệu vật liệu!");
      return;
    }
    setIsSavingMaterial(true);
    try {
      const finalId = materialForm.id || "MAT" + Date.now();
      await supabase.from("materials").upsert({
        ...materialForm,
        id: finalId,
      });
      setShowMaterialModal(false);
      loadMaterials();
      alert("Lưu vật liệu thành công!");
    } catch (error) {
      alert("Lỗi lưu vật liệu.");
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const deleteMaterial = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vật liệu này?")) {
      await supabase.from("materials").delete().eq("id", id);
      loadMaterials();
    }
  };

  // Contacts
  const loadContacts = async () => {
    setLoadingContacts(true);
    try {
      const { data } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      setContacts(data || []);
    } catch {}
    setLoadingContacts(false);
  };

  // Tải cấu hình chữ trang chủ (Content Editor)
  const loadConfigs = async () => {
    try {
      const { data } = await supabase.from("content").select("*");
      if (data && data.length > 0) {
        const obj = { ...configs };
        data.forEach((item) => {
          obj[item.key] = item.value;
        });
        setConfigs(obj);
      }
    } catch {}
  };

  const handleLogoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedLogoFile(e.target.files[0]);
    }
  };

  const saveConfigs = async (e) => {
    e.preventDefault();
    setIsSavingConfigs(true);
    try {
      let logoUrl = configs.logo_image || "";

      if (selectedLogoFile) {
        const comp = await compressImage(selectedLogoFile, 300);
        const blob = base64ToBlob(comp.base64, "image/png");
        const cleanName = sanitizeFilename(comp.filename);
        const filePath = `logo/${Date.now()}_${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, blob, { contentType: "image/png" });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      const updatedConfigs = { ...configs, logo_image: logoUrl };

      const promises = Object.keys(updatedConfigs).map((key) =>
        supabase.from("content").upsert({
          key: key,
          value: updatedConfigs[key],
        })
      );
      await Promise.all(promises);
      alert("Lưu cấu hình trang chủ thành công!");
      setSelectedLogoFile(null);
      loadConfigs();
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu cấu hình.");
    } finally {
      setIsSavingConfigs(false);
    }
  };

  // Tải danh sách tuyển dụng
  const loadRecruitment = async () => {
    setLoadingRecruitment(true);
    try {
      const { data } = await supabase
        .from("recruitment")
        .select("*")
        .order("created_at", { ascending: false });
      setRecruitmentList(data || []);
    } catch {}
    setLoadingRecruitment(false);
  };

  const deleteRecruit = async (id) => {
    if (window.confirm("Xóa hồ sơ ứng tuyển này?")) {
      await supabase.from("recruitment").delete().eq("id", id);
      loadRecruitment();
    }
  };

  // ==========================================
  // NÂNG CẤP: CRUD QUẢN LÝ ẢNH GIẢ LẬP 3D (SIMULATOR)
  // ==========================================
  const loadSimulator = async () => {
    setLoadingSimulator(true);
    try {
      const { data } = await supabase.from("simulator").select("*");
      setSimulatorItems(data || []);
    } catch {
      console.warn("Lỗi tải ảnh giả lập.");
    }
    setLoadingSimulator(false);
  };

  const saveSimulator = async (e) => {
    e.preventDefault();
    if (!simulatorForm.room_name) {
      alert("Vui lòng chọn Tên Phòng cần cấu hình!");
      return;
    }
    setIsSavingSimulator(true);
    try {
      const uploadedUrls = [];
      for (const file of selectedFiles) {
        const comp = await compressImage(file, 1200);
        const blob = base64ToBlob(comp.base64, "image/jpeg");
        const cleanName = sanitizeFilename(comp.filename);
        const filePath = `simulator/${Date.now()}_${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, blob, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const currentImagesList = simulatorForm.image ? simulatorForm.image.split("|").filter(Boolean) : [];
      const finalImageString = [...currentImagesList, ...uploadedUrls].join("|");

      // Đồng bộ hóa khóa ID bằng cách trải (...simulatorForm) sau cùng để tránh ghi đè ID rỗng
      const cleanId = simulatorForm.id || sanitizeFilename(simulatorForm.room_name);

      const { error } = await supabase.from("simulator").upsert({
        ...simulatorForm,
        id: cleanId,
        image: finalImageString,
      });

      if (error) throw error;

      setShowSimulatorModal(false);
      setSelectedFiles([]);
      loadSimulator();
      alert("Cập nhật album ảnh phòng 3D thành công!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSavingSimulator(false);
    }
  };

  const handleDeleteSimSubImage = (indexToDelete) => {
    const currentImagesList = simulatorForm.image ? simulatorForm.image.split("|").filter(Boolean) : [];
    const updatedList = currentImagesList.filter((_, idx) => idx !== indexToDelete);
    setSimulatorForm({
      ...simulatorForm,
      image: updatedList.join("|"),
    });
  };

  const deleteSimulator = async (id) => {
    if (window.confirm("Xóa toàn bộ album của phòng này?")) {
      await supabase.from("simulator").delete().eq("id", id);
      loadSimulator();
    }
  };

  // NÂNG CẤP ĐẶC BIỆT: Bộ phân tích Ghi chú khách hàng để hiển thị ảnh Thumbnail nhỏ trực tiếp
  const renderContactNote = (note) => {
    if (!note) return "—";
    
    // Tìm liên kết URL trong văn bản ghi chú
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = note.match(urlRegex);
    if (matches && matches.length > 0) {
      const url = matches[0];
      const textWithoutUrl = note.replace(url, "");
      return (
        <div>
          {textWithoutUrl}
          <div style={{ marginTop: "0.5rem" }}>
            <a href={url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              🖼️ Xem ảnh mẫu khách chọn
            </a>
            {/* Hiển thị trực tiếp ảnh nhỏ thumbnail cực kỳ trực quan */}
            <img src={url} alt="" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "4px", display: "block", marginTop: "0.3rem", border: "1px solid var(--line)" }} />
          </div>
        </div>
      );
    }
    return note;
  };


  return (
    <div id="main" style={{ display: "block" }}>
      {/* TỰ ĐỘNG ĐỒNG BỘ MÀU SẮC ĐÃ CHỌN LÊN GIAO DIỆN ADMIN CHUYÊN NGHIỆP */}
      <style>{`
        :root {
          --accent: ${configs.color_primary || "#e8a020"} !important;
          --accent2: ${configs.color_secondary || "#f5c842"} !important;
        }
      `}</style>

      <div className="topbar">
        <div className="topbar-logo">
          <div className="topbar-icon">🏠</div>
          <div className="topbar-name">
            {configs.brand_name || "ThạchPro"}{" "}
            <span
              style={{
                color: "var(--muted)",
                fontWeight: 400,
                fontSize: ".85rem",
              }}
            >
              / Admin Panel
            </span>
          </div>
        </div>
        <div className="topbar-right">
          <button
            className="view-btn"
            style={{
              background: "rgba(232, 160, 32, 0.1)",
              border: "1px solid var(--line)",
              color: "var(--accent)",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
            onClick={() => setShowPasswordModal(true)}
          >
            🔑 Đổi Mật Khẩu
          </button>
          <button className="logout-btn" onClick={doLogout}>
            Đăng Xuất
          </button>
        </div>
      </div>

      <div className="tabs">
        <div
          className={`tab ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          🖼️ Công Trình
        </div>
        <div
          className={`tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          ⭐ Đánh Giá Khách
        </div>
        <div
          className={`tab ${activeTab === "materials" ? "active" : ""}`}
          onClick={() => setActiveTab("materials")}
        >
          ⚙️ Quản Lý Vật Liệu
        </div>
        <div
          className={`tab ${activeTab === "contacts" ? "active" : ""}`}
          onClick={() => setActiveTab("contacts")}
        >
          📋 Khách Hàng
        </div>
        {/* Tab Quản lý ảnh giả lập 3D chuyên sâu */}
        <div
          className={`tab ${activeTab === "simulator" ? "active" : ""}`}
          onClick={() => setActiveTab("simulator")}
        >
          🎮 Giả Lập 3D ({simulatorItems.length})
        </div>
        <div
          className={`tab ${activeTab === "configs" ? "active" : ""}`}
          onClick={() => setActiveTab("configs")}
        >
          🛠️ Cấu Hình Trang
        </div>
        <div
          className={`tab ${activeTab === "recruitment" ? "active" : ""}`}
          onClick={() => setActiveTab("recruitment")}
        >
          💼 Ứng Tuyển ({recruitmentList.length})
        </div>
      </div>

      <div className="content">
        {/* KHU VỰC THỐNG KÊ NHANH (DASHBOARD) */}
        <div className="stats-row">
          <div className="stat-card" style={{ boxShadow: "0 0 10px rgba(232,160,32,0.1)" }}>
            <div className="stat-ico">🖼️</div>
            <div>
              <div className="stat-num">{galleryItems.length}</div>
              <div className="stat-lbl">Công trình đã đăng</div>
            </div>
          </div>
          <div className="stat-card" style={{ boxShadow: "0 0 10px rgba(232,160,32,0.1)" }}>
            <div className="stat-ico">⭐</div>
            <div>
              <div className="stat-num">{reviews.length}</div>
              <div className="stat-lbl">Đánh giá khách hàng</div>
            </div>
          </div>
          <div className="stat-card" style={{ boxShadow: "0 0 10px rgba(232,160,32,0.1)" }}>
            <div className="stat-ico">📦</div>
            <div>
              <div className="stat-num">{materials.length}</div>
              <div className="stat-lbl">Vật liệu thi công</div>
            </div>
          </div>
          <div className="stat-card" style={{ boxShadow: "0 0 10px rgba(232,160,32,0.1)" }}>
            <div className="stat-ico">🎮</div>
            <div>
              <div className="stat-num">{simulatorItems.length}</div>
              <div className="stat-lbl">Phòng giả lập 3D</div>
            </div>
          </div>
        </div>

        {/* TAB GALLERY */}
        {activeTab === "gallery" && (
          <div className="tab-panel active">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Danh Sách Công Trình</div>
                <div style={{ display: "flex", gap: ".7rem" }}>
                  <button className="btn-refresh" onClick={loadGallery}>
                    🔄 Làm Mới
                  </button>
                  <button
                    className="btn-add"
                    onClick={() => {
                      setGalleryForm({
                        id: "",
                        title: "",
                        category: "",
                        location: "",
                        size: "",
                        image: "",
                      });
                      setSelectedFiles([]);
                      setShowGalleryModal(true);
                    }}
                  >
                    ＋ Thêm Công Trình
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                {loadingGallery ? (
                  <div className="table-loading">⏳ Đang tải...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Album Ảnh</th>
                        <th>Tiêu Đề</th>
                        <th>Danh Mục</th>
                        <th>Địa Điểm</th>
                        <th>Diện Tích</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {galleryItems.map((item) => {
                        const imagesList = item.image ? item.image.split("|").filter(Boolean) : [];
                        return (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", maxWidth: "200px" }}>
                                {imagesList.map((imgUrl, imgIdx) => (
                                  <img
                                    key={imgIdx}
                                    className="td-img"
                                    src={imgUrl}
                                    alt=""
                                    style={{ width: "40px", height: "35px", borderRadius: "4px" }}
                                    onError={(e) => (e.target.style.display = "none")}
                                  />
                                ))}
                                {imagesList.length === 0 && <span style={{ color: "var(--muted)" }}>Không có ảnh</span>}
                              </div>
                            </td>
                            <td className="td-title">{item.title}</td>
                            <td>
                              <span className="cat-badge">{item.category}</span>
                            </td>
                            <td>{item.location || "—"}</td>
                            <td>{item.size || "—"}</td>
                            <td>
                              <div className="action-row">
                                <button
                                  className="btn-edit"
                                  onClick={() => {
                                    setGalleryForm(item);
                                    setSelectedFiles([]);
                                    setShowGalleryModal(true);
                                  }}
                                >
                                  ✏️ Sửa Album
                                </button>
                                <button
                                  className="btn-del"
                                  onClick={() => deleteGallery(item.id)}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB REVIEWS */}
        {activeTab === "reviews" && (
          <div className="tab-panel active">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">
                  ⭐ Quản Lý Đánh Giá Khách Hàng
                </div>
                <div style={{ display: "flex", gap: ".7rem" }}>
                  <button className="btn-refresh" onClick={loadReviews}>
                    🔄 Làm Mới
                  </button>
                  <button
                    className="btn-add"
                    onClick={() => {
                      setReviewForm({
                        id: "",
                        name: "",
                        role: "",
                        project: "",
                        stars: 5,
                        text: "",
                        avatar: "",
                      });
                      setSelectedAvatarFile(null);
                      setShowReviewModal(true);
                    }}
                  >
                    ＋ Thêm Đánh Giá
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                {loadingReviews ? (
                  <div className="table-loading">⏳ Đang tải...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Avatar</th>
                        <th>Khách Hàng</th>
                        <th>Chức Vụ</th>
                        <th>Dự Án</th>
                        <th>Số Sao</th>
                        <th>Nội Dung</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--c3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid var(--line)" }}>
                              {item.avatar ? (
                                <img src={item.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>{item.name ? item.name.charAt(0).toUpperCase() : "T"}</span>
                              )}
                            </div>
                          </td>
                          <td className="td-title">{item.name}</td>
                          <td>{item.role}</td>
                          <td>{item.project}</td>
                          <td>{item.stars} ⭐</td>
                          <td
                            style={{
                              maxWidth: "300px",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.text}
                          </td>
                          <td>
                            <div className="action-row">
                              <button
                                className="btn-edit"
                                onClick={() => {
                                  setReviewForm(item);
                                  setSelectedAvatarFile(null);
                                  setShowReviewModal(true);
                                }}
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                className="btn-del"
                                onClick={() => deleteReview(item.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB MATERIALS */}
        {activeTab === "materials" && (
          <div className="tab-panel active">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">📦 Quản Lý Danh Mục Vật Liệu</div>
                <div style={{ display: "flex", gap: ".7rem" }}>
                  <button className="btn-refresh" onClick={loadMaterials}>
                    🔄 Làm Mới
                  </button>
                  <button
                    className="btn-add"
                    onClick={() => {
                      setMaterialForm({
                        id: "",
                        brand: "",
                        name: "",
                        desc: "",
                        tags: "",
                        icon: "",
                      });
                      setShowMaterialModal(true);
                    }}
                  >
                    ＋ Thêm Vật Liệu
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                {loadingMaterials ? (
                  <div className="table-loading">⏳ Đang tải...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Icon</th>
                        <th>Hãng Vật Liệu</th>
                        <th>Tên Vật Liệu</th>
                        <th>Mô Tả</th>
                        <th>Nhãn</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((item) => (
                        <tr key={item.id}>
                          <td
                            style={{ fontSize: "1.5rem", textAlign: "center" }}
                          >
                            {item.icon}
                          </td>
                          <td className="td-title">{item.brand}</td>
                          <td>
                            <strong>{item.name}</strong>
                          </td>
                          <td
                            style={{
                              maxWidth: "220px",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.desc}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                gap: "0.3rem",
                                flexWrap: "wrap",
                              }}
                            >
                              {item.tags &&
                                item.tags.split("|").map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="cat-badge"
                                    style={{ fontSize: "0.65rem" }}
                                  >
                                    {t}
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td>
                            <div className="action-row">
                              <button
                                className="btn-edit"
                                onClick={() => {
                                  setMaterialForm(item);
                                  setShowMaterialModal(true);
                                }}
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                className="btn-del"
                                onClick={() => deleteMaterial(item.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTACTS */}
        {activeTab === "contacts" && (
          <div className="tab-panel active">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">📋 Khách Hàng Gửi Liên Hệ</div>
                <div style={{ display: "flex", gap: ".7rem" }}>
                  <button className="btn-refresh" onClick={loadContacts}>
                    🔄 Làm Mới
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                {loadingContacts ? (
                  <div className="table-loading">⏳ Đang tải...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Thời Gian</th>
                        <th>Họ Tên</th>
                        <th>SĐT</th>
                        <th>Email</th>
                        <th>Dịch Vụ</th>
                        <th>Diện Tích</th>
                        <th>Địa Điểm</th>
                        <th>Ghi Chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((row) => (
                        <tr key={row.id}>
                          <td>
                            {new Date(row.created_at).toLocaleString("vi-VN")}
                          </td>
                          <td className="td-title">{row.name}</td>
                          <td>{row.phone}</td>
                          <td>{row.email || "—"}</td>
                          <td>
                            <span className="cat-badge">
                              {row.service || "—"}
                            </span>
                          </td>
                          <td>{row.area || "—"}</td>
                          <td>{row.address || "—"}</td>
                          <td>{renderContactNote(row.note)}</td> {/* Đã tích hợp tính năng hiển thị ảnh Thumbnail thông minh */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB QUẢN LÝ ALBUM ẢNH GIẢ LẬP 3D (SIMULATOR) */}
        {activeTab === "simulator" && (
          <div className="tab-panel active">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">🎮 Quản Lý Album Ảnh Mô Phỏng Phòng 3D</div>
                <div style={{ display: "flex", gap: ".7rem" }}>
                  <button className="btn-refresh" onClick={loadSimulator}>
                    🔄 Làm Mới
                  </button>
                  <button
                    className="btn-add"
                    onClick={() => {
                      setSimulatorForm({
                        id: "",
                        room_name: "",
                        image: "",
                      });
                      setSelectedFiles([]);
                      setShowSimulatorModal(true);
                    }}
                  >
                    ＋ Tải Ảnh Phòng 3D
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                {loadingSimulator ? (
                  <div className="table-loading">⏳ Đang tải...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Album Ảnh Giả Lập</th>
                        <th>Không Gian Phòng</th>
                        <th>Số lượng ảnh</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulatorItems.map((item) => {
                        const imagesList = item.image ? item.image.split("|").filter(Boolean) : [];
                        return (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", maxWidth: "300px" }}>
                                {imagesList.map((imgUrl, imgIdx) => (
                                  <img
                                    key={imgIdx}
                                    src={imgUrl}
                                    alt=""
                                    style={{ width: "50px", height: "40px", borderRadius: "4px", objectFit: "cover" }}
                                    onError={(e) => (e.target.style.display = "none")}
                                  />
                                ))}
                                {imagesList.length === 0 && <span style={{ color: "var(--muted)" }}>Chưa tải ảnh</span>}
                              </div>
                            </td>
                            <td className="td-title" style={{ fontSize: "1rem" }}>{item.room_name}</td>
                            <td>
                              <span className="cat-badge">{imagesList.length} ảnh</span>
                            </td>
                            <td>
                              <div className="action-row">
                                <button
                                  className="btn-edit"
                                  onClick={() => {
                                    setSimulatorForm(item);
                                    setSelectedFiles([]);
                                    setShowSimulatorModal(true);
                                  }}
                                >
                                  ✏️ Quản Lý Ảnh
                                </button>
                                <button
                                  className="btn-del"
                                  onClick={() => deleteSimulator(item.id)}
                                >
                                  🗑️ Xóa Sạch
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {simulatorItems.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                            Chưa có phòng 3D nào được cấu hình ảnh. Hãy bấm "Tải Ảnh Phòng 3D" để bắt đầu!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB CẤU HÌNH TRANG CHỦ */}
        {activeTab === "configs" && (
          <div className="tab-panel active">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">⚙️ Cấu Hình Thông Tin Chữ & Màu Sắc Giao Diện</div>
              </div>
              <form onSubmit={saveConfigs} className="section-fields">
                
                {/* Tùy chỉnh màu sắc */}
                <div style={{ background: "rgba(232,160,32,0.05)", padding: "1.5rem", borderRadius: "10px", border: "1px dashed var(--line)", marginBottom: "1.5rem" }}>
                  <div className="panel-title" style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>🎨 Tùy Chỉnh Màu Sắc Giao Diện</div>
                  <div className="mf-row" style={{ margin: 0, gap: "1.5rem" }}>
                    <div className="mf-field" style={{ margin: 0 }}>
                      <label className="mf-label">Màu Chủ Đạo (Primary Color)</label>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="color"
                          value={configs.color_primary || "#e8a020"}
                          onChange={(e) => setConfigs({ ...configs, color_primary: e.target.value })}
                          style={{ width: "50px", height: "40px", border: "none", background: "none", cursor: "pointer" }}
                        />
                        <span style={{ fontFamily: "monospace", color: "var(--muted)" }}>{configs.color_primary}</span>
                      </div>
                    </div>
                    <div className="mf-field" style={{ margin: 0 }}>
                      <label className="mf-label">Màu Hover/Phụ (Secondary Color)</label>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="color"
                          value={configs.color_secondary || "#f5c842"}
                          onChange={(e) => setConfigs({ ...configs, color_secondary: e.target.value })}
                          style={{ width: "50px", height: "40px", border: "none", background: "none", cursor: "pointer" }}
                        />
                        <span style={{ fontFamily: "monospace", color: "var(--muted)" }}>{configs.color_secondary}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tùy chỉnh LOGO */}
                <div style={{ background: "rgba(232,160,32,0.05)", padding: "1.5rem", borderRadius: "10px", border: "1px dashed var(--line)", marginBottom: "1.5rem" }}>
                  <div className="panel-title" style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>🏠 Tùy Chỉnh LOGO Hình Ảnh</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <div style={{ width: "80px", height: "60px", background: "var(--c3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid var(--line)", borderRadius: "6px" }}>
                      {selectedLogoFile ? (
                        <img src={URL.createObjectURL(selectedLogoFile)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : configs.logo_image ? (
                        <img src={configs.logo_image} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <span style={{ fontSize: "1.5rem" }}>🏠</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        className="mf-input"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                      />
                      <div className="img-hint">Chọn file ảnh Logo (khuyên dùng định dạng PNG trong suốt hoặc JPG nhỏ gọn). Để trống nếu muốn dùng logo chữ mặc định.</div>
                    </div>
                  </div>
                </div>

                <div className="field-row">
                  <label className="field-label">Tên Thương Hiệu (Logo Chữ)</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.brand_name || ""}
                    onChange={(e) => setConfigs({ ...configs, brand_name: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Hotline Gọi Điện</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.contact_phone || ""}
                    onChange={(e) => setConfigs({ ...configs, contact_phone: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Số Zalo liên hệ</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.contact_zalo || ""}
                    onChange={(e) => setConfigs({ ...configs, contact_zalo: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Email Showroom</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.contact_email || ""}
                    onChange={(e) => setConfigs({ ...configs, contact_email: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Địa Chỉ Showroom</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.contact_address || ""}
                    onChange={(e) => setConfigs({ ...configs, contact_address: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Đường dẫn Google Maps</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.contact_map_url || ""}
                    onChange={(e) => setConfigs({ ...configs, contact_map_url: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Hero Badge nhỏ</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.hero_tag || ""}
                    onChange={(e) => setConfigs({ ...configs, hero_tag: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Tiêu Đề Lớn Banner (Hero) * hỗ trợ thẻ &lt;br&gt;</label>
                  <textarea
                    className="f-textarea"
                    value={configs.hero_title || ""}
                    onChange={(e) => setConfigs({ ...configs, hero_title: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Mô tả ngắn Banner (Hero)</label>
                  <textarea
                    className="f-textarea"
                    value={configs.hero_sub || ""}
                    onChange={(e) => setConfigs({ ...configs, hero_sub: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Nút chính Hero (Vàng)</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.hero_btn1 || ""}
                    onChange={(e) => setConfigs({ ...configs, hero_btn1: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Nút phụ Hero (Ghost)</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.hero_btn2 || ""}
                    onChange={(e) => setConfigs({ ...configs, hero_btn2: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Nhãn Thống Kê 1 (Công trình)</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.stat1_lbl || ""}
                    onChange={(e) => setConfigs({ ...configs, stat1_lbl: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Nhãn Thống Kê 2 (Năm kinh nghiệm)</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.stat2_lbl || ""}
                    onChange={(e) => setConfigs({ ...configs, stat2_lbl: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Nhãn Thống Kê 3 (Hài lòng)</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.stat3_lbl || ""}
                    onChange={(e) => setConfigs({ ...configs, stat3_lbl: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Giờ làm việc</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.contact_hours || ""}
                    onChange={(e) => setConfigs({ ...configs, contact_hours: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Tiêu đề Giới Thiệu (About)</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.about_title || ""}
                    onChange={(e) => setConfigs({ ...configs, about_title: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Mô tả Giới thiệu (About)</label>
                  <textarea
                    className="f-textarea"
                    value={configs.about_desc || ""}
                    onChange={(e) => setConfigs({ ...configs, about_desc: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Tiêu đề CTA</label>
                  <textarea
                    className="f-textarea"
                    value={configs.cta_title || ""}
                    onChange={(e) => setConfigs({ ...configs, cta_title: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Mô tả CTA</label>
                  <textarea
                    className="f-textarea"
                    value={configs.cta_desc || ""}
                    onChange={(e) => setConfigs({ ...configs, cta_desc: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Nút bấm gọi CTA</label>
                  <input
                    className="f-input"
                    type="text"
                    value={configs.cta_btn || ""}
                    onChange={(e) => setConfigs({ ...configs, cta_btn: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <label className="field-label">Mô Tả Chân Trang (Footer)</label>
                  <textarea
                    className="f-textarea"
                    value={configs.footer_desc || ""}
                    onChange={(e) => setConfigs({ ...configs, footer_desc: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                  <button type="submit" className="btn-save-all" disabled={isSavingConfigs}>
                    {isSavingConfigs ? "⏳ ĐANG LƯU CẤU HÌNH..." : "💾 LƯU CẤU HÌNH"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB TUYỂN DỤNG */}
        {activeTab === "recruitment" && (
          <div className="tab-panel active">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">💼 Danh Sách Hồ Sơ Ứng Tuyển Thợ</div>
                <div style={{ display: "flex", gap: ".7rem" }}>
                  <button className="btn-refresh" onClick={loadRecruitment}>
                    🔄 Làm Mới
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                {loadingRecruitment ? (
                  <div className="table-loading">⏳ Đang tải...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Thời Gian</th>
                        <th>Họ Tên</th>
                        <th>Số Điện Thoại</th>
                        <th>Vị Trí Ứng Tuyển</th>
                        <th>Kinh Nghiệm / Ghi Chú</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruitmentList.map((row) => (
                        <tr key={row.id}>
                          <td>{new Date(row.created_at).toLocaleString("vi-VN")}</td>
                          <td className="td-title">{row.name}</td>
                          <td>{row.phone}</td>
                          <td>
                            <span className="cat-badge">{row.position}</span>
                          </td>
                          <td>{row.experience || "—"}</td>
                          <td>
                            <button className="btn-del" onClick={() => deleteRecruit(row.id)}>
                              🗑️ Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                      {recruitmentList.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                            Chưa có hồ sơ ứng tuyển nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB QUẢN LÝ ALBUM ẢNH GIẢ LẬP 3D (SIMULATOR) */}
        {activeTab === "simulator" && (
          <div className="tab-panel active">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">🎮 Quản Lý Album Ảnh Mô Phỏng Phòng 3D</div>
                <div style={{ display: "flex", gap: ".7rem" }}>
                  <button className="btn-refresh" onClick={loadSimulator}>
                    🔄 Làm Mới
                  </button>
                  <button
                    className="btn-add"
                    onClick={() => {
                      setSimulatorForm({
                        id: "",
                        room_name: "",
                        image: "",
                      });
                      setSelectedFiles([]);
                      setShowSimulatorModal(true);
                    }}
                  >
                    ＋ Tải Ảnh Phòng 3D
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                {loadingSimulator ? (
                  <div className="table-loading">⏳ Đang tải...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Album Ảnh Giả Lập</th>
                        <th>Không Gian Phòng</th>
                        <th>Số lượng ảnh</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulatorItems.map((item) => {
                        const imagesList = item.image ? item.image.split("|").filter(Boolean) : [];
                        return (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", maxWidth: "300px" }}>
                                {imagesList.map((imgUrl, imgIdx) => (
                                  <img
                                    key={imgIdx}
                                    src={imgUrl}
                                    alt=""
                                    style={{ width: "50px", height: "40px", borderRadius: "4px", objectFit: "cover" }}
                                    onError={(e) => (e.target.style.display = "none")}
                                  />
                                ))}
                                {imagesList.length === 0 && <span style={{ color: "var(--muted)" }}>Chưa tải ảnh</span>}
                              </div>
                            </td>
                            <td className="td-title" style={{ fontSize: "1rem" }}>{item.room_name}</td>
                            <td>
                              <span className="cat-badge">{imagesList.length} ảnh</span>
                            </td>
                            <td>
                              <div className="action-row">
                                <button
                                  className="btn-edit"
                                  onClick={() => {
                                    setSimulatorForm(item);
                                    setSelectedFiles([]);
                                    setShowSimulatorModal(true);
                                  }}
                                >
                                  ✏️ Quản Lý Ảnh
                                </button>
                                <button
                                  className="btn-del"
                                  onClick={() => deleteSimulator(item.id)}
                                >
                                  🗑️ Xóa Sạch
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {simulatorItems.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                            Chưa có phòng 3D nào được cấu hình ảnh. Hãy bấm "Tải Ảnh Phòng 3D" để bắt đầu!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL QUẢN LÝ QUẢN LÝ ẢNH GIẢ LẬP 3D (SIMULATOR) */}
        {showSimulatorModal && (
          <div className="modal-bg open">
            <div className="modal">
              <button
                className="modal-close"
                onClick={() => setShowSimulatorModal(false)}
              >
                ✕
              </button>
              <div className="modal-title">🎮 Cấu Hình Album Ảnh Phòng 3D</div>
              <form onSubmit={saveSimulator}>
                <div className="mf-field">
                  <label className="mf-label">Không Gian Phòng Cần Cấu Hình *</label>
                  <select
                    className="mf-select"
                    value={simulatorForm.room_name}
                    onChange={(e) => setSimulatorForm({ ...simulatorForm, room_name: e.target.value })}
                    required
                    disabled={!!simulatorForm.id} 
                  >
                    <option value="">-- Chọn không gian phòng mẫu --</option>
                    {SIMULATOR_ROOMS.map((room, idx) => (
                      <option key={idx} value={room}>{room}</option>
                    ))}
                  </select>
                </div>

                {/* Lưới ảnh hiện có của phòng giả lập này */}
                {simulatorForm.image && (
                  <div className="mf-field">
                    <label className="mf-label">Ảnh Album Hiện Có (Bấm ✕ để xóa từng ảnh)</label>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", background: "var(--c3)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--line)" }}>
                      {simulatorForm.image.split("|").filter(Boolean).map((imgUrl, idx) => (
                        <div key={idx} style={{ position: "relative", width: "70px", height: "60px" }}>
                          <img src={imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                          <button
                            type="button"
                            onClick={() => handleDeleteSimSubImage(idx)}
                            style={{ position: "absolute", top: "-5px", right: "-5px", width: "18px", height: "18px", borderRadius: "50%", background: "var(--red)", color: "white", border: "none", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mf-field">
                  <label className="mf-label">Chọn thêm ảnh trần thạch cao thực tế (Cho phép chọn nhiều ảnh mới)</label>
                  <input
                    className="mf-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="img-hint">Ảnh sau khi tải lên sẽ được hiển thị dạng slide lướt Trái/Phải ngoài khu vực mô phỏng 3D trang chủ ứng với từng phòng.</div>
                  {selectedFiles.length > 0 && (
                    <p style={{ color: "var(--accent)", marginTop: "0.5rem" }}>
                      📂 Đã chọn thêm {selectedFiles.length} ảnh mới để tải lên.
                    </p>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-cancel"
                    type="button"
                    onClick={() => setShowSimulatorModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn-modal-save"
                    type="submit"
                    disabled={isSavingSimulator}
                  >
                    {isSavingSimulator ? "⏳ ĐANG LƯU..." : "💾 LƯU ALBUM PHÒNG"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}