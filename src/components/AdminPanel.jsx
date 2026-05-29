// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "../AdminPanel.css"; // Đã kết nối với file CSS riêng biệt

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
    text: "ThạchCaoSố1 hoàn thành toàn bộ trần giật cấp và vách ngăn penthouse 450m² chỉ trong 10 ngày. Bề mặt cực kỳ mịn, đường nét sắc sảo, đội thợ sạch sẽ and chuyên nghiệp. Rất hài lòng và sẽ giới thiệu cho bạn bè!",
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
  const [showPassword, setShowPassword] = useState(false);
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
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]); // Đã tách riêng biệt
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
    brand_name: "ThạchCaoSố1",
    contact_phone: "0901 234 567",
    contact_zalo: "0901 234 567",
    contact_email: "thachpro@gmail.com",
    contact_address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    contact_map_url: "https://maps.google.com/?q=10.732498,106.717207",
    hero_tag: "Đang nhận dự án — TP.HCM & Bình Dương",
    hero_title: "Kiến Tạo<br>Không Gian<br><em>Hoàn Hảo</em>",
    hero_sub:
      "Đơn vị thi công thạch cao hàng đầu tại TP.HCM — trần giật cấp, vách ngăn, phào chỉ trang trí. Cung cấp vật liệu xây dựng cao cấp Knauf, USG chính hãng, giao tận công trình.",
    hero_btn1: "→ Nhận Báo Giá Miễn Phí",
    hero_btn2: "Xem Công Trình →",
    stat1_lbl: "Công trình hoàn thành",
    stat2_lbl: "Năm kinh nghiệm",
    stat3_lbl: "Khách hàng hài lòng",
    contact_hours: "Hotline 7:00–18:00",
    about_title: "Hơn 15 Năm Xây Dựng Niềm Tin",
    about_desc:
      "ThạchCaoSố1 được thành lập lâu năm, đã hoàn thiện hơn 500 công trình từ căn hộ cao cấp, biệt thự, văn phòng đến trung tâm thương mại trên toàn TP.HCM.",
    cta_title: "Bắt Đầu Dự Án<br/>Của Bạn Hôm Ngày",
    cta_desc:
      "Liên hệ ngay để được tư vấn miễn phí và nhận báo giá trong 24 giờ. Đội ngũ ThạchCaoSố1 luôn sẵn sàng biến ý tưởng của bạn thành hiện thực.",
    cta_btn: "📞 Gọi Ngay: 0901 234 567",
    footer_desc:
      "Đơn vị thi công thạch cao và cung cấp vật liệu xây dựng chuyên nghiệp tại TP.HCM từ năm 2008.",
    color_primary: "#e8a020",
    color_secondary: "#f5c842",
    logo_image: "",
  });
  const [isSavingConfigs, setIsSavingConfigs] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);

  // Danh sách hồ sơ ứng tuyển tuyển dụng (Recruitment)
  const [recruitmentList, setRecruitmentList] = useState([]);
  const [loadingRecruitment, setLoadingRecruitment] = useState(false);

  // States quản lý dữ liệu GIẢ LẬP 3D (Simulator)
  const [simulatorItems, setSimulatorItems] = useState([]);
  const [loadingSimulator, setLoadingSimulator] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [simulatorForm, setSimulatorForm] = useState({
    id: "",
    room_name: "",
    image: "",
  });
  const [selectedSimulatorFiles, setSelectedSimulatorFiles] = useState([]); // Đã tách riêng biệt
  const [isSavingSimulator, setIsSavingSimulator] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const loginTimeStr = localStorage.getItem("admin_login_time");

    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr);
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (Date.now() - loginTime > twentyFourHours) {
        alert(
          "Phiên làm việc đã hết hạn (Quá 24 giờ). Hệ thống tự động đăng xuất để bảo mật!"
        );
        await doLogout();
        return;
      }
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsAuthenticated(false);
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
    if (!emailInput.trim() || !passwordInput.trim()) {
      alert("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!");
      return;
    }
    setIsLoggingIn(true);
    setLoginError(false);
    try {
      const isEmailFormat = emailInput.includes("@");
      
      // Hỗ trợ định dạng SĐT chuẩn Việt Nam sang chuẩn quốc tế của Supabase
      let formattedUser = emailInput.trim();
      if (!isEmailFormat && formattedUser.startsWith("0")) {
        formattedUser = "+84" + formattedUser.slice(1);
      }

      const credentials = isEmailFormat
        ? { email: formattedUser, password: passwordInput }
        : { phone: formattedUser, password: passwordInput };

      const { data, error } = await supabase.auth.signInWithPassword(
        credentials
      );

      if (error) {
        setLoginError(true);
        setPasswordInput("");
        alert("Đăng nhập thất bại: " + error.message);
      } else {
        localStorage.setItem("admin_login_time", Date.now().toString());
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (err) {
      alert("Lỗi kết nối tới máy chủ Supabase.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const doLogout = async () => {
    localStorage.removeItem("admin_login_time");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Đăng xuất: " + error.message);
    }
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
    } catch (err) {
      alert("Lỗi tải danh mục công trình: " + err.message);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedGalleryFiles(Array.from(e.target.files));
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
      let index = 0;
      for (const file of selectedGalleryFiles) {
        const comp = await compressImage(file, 1200);
        const blob = base64ToBlob(comp.base64, "image/jpeg");
        const cleanName = sanitizeFilename(comp.filename);
        // Sửa lỗi trùng tên file khi up hàng loạt bằng cách thêm index và chuỗi ngẫu nhiên
        const randStr = Math.random().toString(36).substring(2, 7);
        const filePath = `gallery/${Date.now()}_${index}_${randStr}_${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, blob, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        index++;
      }

      const currentImagesList = galleryForm.image
        ? galleryForm.image.split("|").filter(Boolean)
        : [];
      const finalImageString = [...currentImagesList, ...uploadedUrls].join(
        "|"
      );

      const randId = Math.random().toString(36).substring(2, 7);
      const { error } = await supabase.from("gallery").upsert({
        id: galleryForm.id || "CT" + Date.now() + "_" + randId,
        title: galleryForm.title,
        category: galleryForm.category,
        location: galleryForm.location,
        size: galleryForm.size,
        image: finalImageString,
      });

      if (error) throw error;

      setShowGalleryModal(false);
      setSelectedGalleryFiles([]);
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
    const currentImagesList = galleryForm.image
      ? galleryForm.image.split("|").filter(Boolean)
      : [];
    const updatedList = currentImagesList.filter(
      (_, idx) => idx !== indexToDelete
    );
    setGalleryForm({
      ...galleryForm,
      image: updatedList.join("|"),
    });
  };

  const deleteGallery = async (id) => {
    if (window.confirm("Chắc chắn xóa công trình này?")) {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) alert("Lỗi xóa công trình: " + error.message);
      loadGallery();
    }
  };

  // CRUD Reviews
  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const { data, error } = await supabase.from("reviews").select("*");
      if (error) throw error;
      const dbReviews = data || [];
      const combined = DEFAULT_REVIEWS.map((def) => {
        const edited = dbReviews.find((db) => db.id === def.id);
        return edited ? edited : def;
      });
      const newlyAdded = dbReviews.filter(
        (db) => !DEFAULT_REVIEWS.some((def) => def.id === def.id)
      );
      setReviews([...combined, ...newlyAdded]);
    } catch (err) {
      alert("Lỗi tải đánh giá: " + err.message);
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

      const randId = Math.random().toString(36).substring(2, 7);
      const finalId = reviewForm.id || "RV" + Date.now() + "_" + randId;

      const { error } = await supabase.from("reviews").upsert({
        ...reviewForm,
        id: finalId,
        avatar: avatarUrl,
      });
      if (error) throw error;

      setShowReviewModal(false);
      setSelectedAvatarFile(null);
      loadReviews();
      alert("Lưu đánh giá thành công!");
    } catch (error) {
      alert("Lưu đánh giá lỗi: " + error.message);
    } finally {
      setIsSavingReview(false);
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm("Xóa đánh giá này?")) {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) alert("Lỗi xóa đánh giá: " + error.message);
      loadReviews();
    }
  };

  // CRUD Materials
  const loadMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const { data, error } = await supabase.from("materials").select("*");
      if (error) throw error;
      const dbMaterials = data || [];
      const combined = DEFAULT_MATERIALS.map((def) => {
        const edited = dbMaterials.find((db) => db.id === def.id);
        return edited ? edited : def;
      });
      const newlyAdded = dbMaterials.filter(
        (db) => !DEFAULT_MATERIALS.some((def) => def.id === db.id)
      );
      setMaterials([...combined, ...newlyAdded]);
    } catch (err) {
      alert("Lỗi tải vật liệu: " + err.message);
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
      const randId = Math.random().toString(36).substring(2, 7);
      const finalId = materialForm.id || "MAT" + Date.now() + "_" + randId;
      const { error } = await supabase.from("materials").upsert({
        ...materialForm,
        id: finalId,
      });
      if (error) throw error;
      setShowMaterialModal(false);
      loadMaterials();
      alert("Lưu vật liệu thành công!");
    } catch (error) {
      alert("Lỗi lưu vật liệu: " + error.message);
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const deleteMaterial = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vật liệu này?")) {
      const { error } = await supabase.from("materials").delete().eq("id", id);
      if (error) alert("Lỗi xóa vật liệu: " + error.message);
      loadMaterials();
    }
  };

  // Contacts
  const loadContacts = async () => {
    setLoadingContacts(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      alert("Lỗi tải liên hệ khách hàng: " + err.message);
    }
    setLoadingContacts(false);
  };

  // Tải cấu hình chữ trang chủ (Content Editor)
  const loadConfigs = async () => {
    try {
      const { data, error } = await supabase.from("content").select("*");
      if (error) throw error;
      if (data && data.length > 0) {
        const obj = { ...configs };
        data.forEach((item) => {
          obj[item.key] = item.value;
        });
        setConfigs(obj);
      }
    } catch (err) {
      alert("Lỗi tải cấu hình: " + err.message);
    }
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
      alert("Lỗi lưu cấu hình: " + err.message);
    } finally {
      setIsSavingConfigs(false);
    }
  };

  // Tải danh sách tuyển dụng
  const loadRecruitment = async () => {
    setLoadingRecruitment(true);
    try {
      const { data, error } = await supabase
        .from("recruitment")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRecruitmentList(data || []);
    } catch (err) {
      alert("Lỗi tải danh sách ứng tuyển: " + err.message);
    }
    setLoadingRecruitment(false);
  };

  const deleteRecruit = async (id) => {
    if (window.confirm("Xóa hồ sơ ứng tuyển này?")) {
      const { error } = await supabase.from("recruitment").delete().eq("id", id);
      if (error) alert("Lỗi xóa hồ sơ: " + error.message);
      loadRecruitment();
    }
  };

  // CRUD QUẢN LÝ ẢNH GIẢ LẬP 3D (SIMULATOR)
  const loadSimulator = async () => {
    setLoadingSimulator(true);
    try {
      const { data, error } = await supabase.from("simulator").select("*");
      if (error) throw error;
      setSimulatorItems(data || []);
    } catch (err) {
      alert("Lỗi tải giả lập: " + err.message);
    }
    setLoadingSimulator(false);
  };

  const handleSimulatorFileChange = (e) => {
    if (e.target.files) {
      setSelectedSimulatorFiles(Array.from(e.target.files));
    }
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
      let index = 0;
      for (const file of selectedSimulatorFiles) {
        const comp = await compressImage(file, 1200);
        const blob = base64ToBlob(comp.base64, "image/jpeg");
        const cleanName = sanitizeFilename(comp.filename);
        const randStr = Math.random().toString(36).substring(2, 7);
        const filePath = `simulator/${Date.now()}_${index}_${randStr}_${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, blob, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        index++;
      }

      const currentImagesList = simulatorForm.image
        ? simulatorForm.image.split("|").filter(Boolean)
        : [];
      const finalImageString = [...currentImagesList, ...uploadedUrls].join(
        "|"
      );

      const cleanId =
        simulatorForm.id || sanitizeFilename(simulatorForm.room_name);

      const { error } = await supabase.from("simulator").upsert({
        id: cleanId,
        room_name: simulatorForm.room_name,
        image: finalImageString,
      });

      if (error) throw error;

      setShowSimulatorModal(false);
      setSelectedSimulatorFiles([]);
      loadSimulator();
      alert("Cập nhật album ảnh phòng 3D thành công!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra: " + err.message);
    } finally {
      setIsSavingSimulator(false);
    }
  };

  const handleDeleteSimSubImage = (indexToDelete) => {
    const currentImagesList = simulatorForm.image
      ? simulatorForm.image.split("|").filter(Boolean)
      : [];
    const updatedList = currentImagesList.filter(
      (_, idx) => idx !== indexToDelete
    );
    setSimulatorForm({
      ...simulatorForm,
      image: updatedList.join("|"),
    });
  };

  const deleteSimulator = async (id) => {
    if (window.confirm("Xóa toàn bộ album của phòng này?")) {
      const { error } = await supabase.from("simulator").delete().eq("id", id);
      if (error) alert("Lỗi xóa: " + error.message);
      loadSimulator();
    }
  };

  const renderContactNote = (note) => {
    if (!note) return "—";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = note.match(urlRegex);
    if (matches && matches.length > 0) {
      const url = matches[0];
      const textWithoutUrl = note.replace(url, "");
      return (
        <div>
          {textWithoutUrl}
          <div style={{ marginTop: "0.5rem" }}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "var(--accent)",
                textDecoration: "underline",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              🖼️ Xem ảnh mẫu khách chọn
            </a>
            <img
              src={url}
              alt=""
              style={{
                width: "80px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "4px",
                display: "block",
                marginTop: "0.3rem",
                border: "1px solid var(--line)",
              }}
            />
          </div>
        </div>
      );
    }
    return note;
  };

  if (!isAuthenticated) {
    return (
      <div id="login-screen">
        <div className="login-box">
          <div className="login-logo">🏠</div>
          <div className="login-title">
            Thạch<span>Pro</span> Admin
          </div>
          <div className="login-sub">Nhập tài khoản & mật khẩu để tiếp tục</div>
          <input
            className="login-input"
            type="text"
            placeholder="admin@thachpro.vn hoặc Số điện thoại"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            style={{
              marginBottom: "0.8rem",
              letterSpacing: "normal",
              textAlign: "left",
            }}
            disabled={isLoggingIn}
          />

          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doLogin()}
              disabled={isLoggingIn}
              style={{ paddingRight: "2.5rem", margin: 0 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <button
            className="login-btn"
            onClick={doLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "⏳ Đang xác thực..." : "🔐 Đăng Nhập"}
          </button>
          {loginError && (
            <div className="login-error" style={{ marginTop: "1rem" }}>
              ❌ Email/SĐT hoặc Mật khẩu không chính xác!
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="main" style={{ display: "block" }}>
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
            {configs.brand_name || "ThạchCaoSố1"}{" "}
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
        {/* --- TAB GALLERY --- */}
        {activeTab === "gallery" && (
          <div>
            <div className="section-header">
              <h2>🖼️ Quản Lý Danh Mục Công Trình</h2>
              <button
                className="add-btn"
                onClick={() => {
                  setGalleryForm({ id: "", title: "", category: "Trần thạch cao phòng khách", location: "", size: "", image: "" });
                  setSelectedGalleryFiles([]);
                  setShowGalleryModal(true);
                }}
              >
                + Thêm Công Trình Mới
              </button>
            </div>

            {loadingGallery ? <p>Đang tải dữ liệu...</p> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tiêu đề</th>
                    <th>Danh mục</th>
                    <th>Vị trí / Diện tích</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {galleryItems.map((item) => {
                    const firstImg = item.image ? item.image.split("|")[0] : "";
                    return (
                      <tr key={item.id}>
                        <td>
                          {firstImg && <img src={firstImg} alt="" style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "4px" }} />}
                        </td>
                        <td><strong>{item.title}</strong></td>
                        <td><span className="badge">{item.category}</span></td>
                        <td>{item.location || "—"} {item.size ? `· ${item.size}` : ""}</td>
                        <td>
                          <button className="edit-sub-btn" onClick={() => { setGalleryForm(item); setSelectedGalleryFiles([]); setShowGalleryModal(true); }}>Sửa</button>
                          <button className="delete-sub-btn" onClick={() => deleteGallery(item.id)}>Xóa</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* --- TAB REVIEWS --- */}
        {activeTab === "reviews" && (
          <div>
            <div className="section-header">
              <h2>⭐ Đánh Giá Từ Khách Hàng</h2>
              <button
                className="add-btn"
                onClick={() => {
                  setReviewForm({ id: "", name: "", role: "", project: "", stars: 5, text: "", avatar: "" });
                  setSelectedAvatarFile(null);
                  setShowReviewModal(true);
                }}
              >
                + Thêm Đánh Giá Mới
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Họ Tên</th>
                  <th>Dự Án</th>
                  <th>Nội Dung</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <img src={r.avatar || "https://via.placeholder.com/40"} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                    </td>
                    <td>
                      <strong>{r.name}</strong>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{r.role}</div>
                    </td>
                    <td>{r.project} ({r.stars}⭐)</td>
                    <td style={{ maxWidth: "300px", fontSize: "0.9rem" }}>{r.text}</td>
                    <td>
                      <button className="edit-sub-btn" onClick={() => { setReviewForm(r); setSelectedAvatarFile(null); setShowReviewModal(true); }}>Sửa</button>
                      <button className="delete-sub-btn" onClick={() => deleteReview(r.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- TAB MATERIALS --- */}
        {activeTab === "materials" && (
          <div>
            <div className="section-header">
              <h2>⚙️ Danh Mục Vật Liệu Cung Cấp</h2>
              <button
                className="add-btn"
                onClick={() => {
                  setMaterialForm({ id: "", brand: "", name: "", desc: "", tags: "", icon: "🧱" });
                  setShowMaterialModal(true);
                }}
              >
                + Thêm Vật Liệu Mới
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Thương hiệu / Tên</th>
                  <th>Mô tả</th>
                  <th>Thẻ phân loại</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontSize: "1.5rem" }}>{m.icon}</td>
                    <td>
                      <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: "bold" }}>{m.brand}</div>
                      <strong>{m.name}</strong>
                    </td>
                    <td style={{ fontSize: "0.85rem", maxWidth: "250px" }}>{m.desc}</td>
                    <td>
                      {m.tags && m.tags.split("|").map((t, idx) => (
                        <span key={idx} className="badge" style={{ marginRight: "4px" }}>{t}</span>
                      ))}
                    </td>
                    <td>
                      <button className="edit-sub-btn" onClick={() => { setMaterialForm(m); setShowMaterialModal(true); }}>Sửa</button>
                      <button className="delete-sub-btn" onClick={() => deleteMaterial(m.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- TAB CONTACTS --- */}
        {activeTab === "contacts" && (
          <div>
            <h2>📋 Danh Sách Khách Hàng Để Lại Thông Tin</h2>
            {loadingContacts ? <p>Đang tải...</p> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ngày Gửi</th>
                    <th>Khách Hàng</th>
                    <th>Dịch Vụ Yêu Cầu</th>
                    <th>Ghi Chú Đặc Biệt</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontSize: "0.85rem" }}>{c.created_at ? new Date(c.created_at).toLocaleString("vi-VN") : "—"}</td>
                      <td>
                        <strong>{c.name}</strong>
                        <div>📞 <a href={`tel:${c.phone}`} style={{ textDecoration: "underline" }}>{c.phone}</a></div>
                      </td>
                      <td><span className="badge" style={{ background: "rgba(232,160,32,0.15)", color: "var(--accent)" }}>{c.service || "Tư vấn chung"}</span></td>
                      <td>{renderContactNote(c.note)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* --- TAB SIMULATOR --- */}
        {activeTab === "simulator" && (
          <div>
            <div className="section-header">
              <h2>🎮 Quản Lý Ảnh Thực Tế Giả Lập 3D</h2>
              <button
                className="add-btn"
                onClick={() => {
                  setSimulatorForm({ id: "", room_name: SIMULATOR_ROOMS[0], image: "" });
                  setSelectedSimulatorFiles([]);
                  setShowSimulatorModal(true);
                }}
              >
                + Cấu Hình Phòng Mới
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên Không Gian Phòng</th>
                  <th>Số Lượng Ảnh Album</th>
                  <th>Xem Trước Ảnh</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {simulatorItems.map((s) => {
                  const imgs = s.image ? s.image.split("|").filter(Boolean) : [];
                  return (
                    <tr key={s.id}>
                      <td><strong>{s.room_name}</strong></td>
                      <td><span className="badge">{imgs.length} Ảnh</span></td>
                      <td>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                          {imgs.slice(0, 4).map((img, idx) => (
                            <img key={idx} src={img} alt="" style={{ width: "40px", height: "30px", objectFit: "cover", borderRadius: "2px" }} />
                          ))}
                          {imgs.length > 4 && <span>...</span>}
                        </div>
                      </td>
                      <td>
                        <button className="edit-sub-btn" onClick={() => { setSimulatorForm(s); setSelectedSimulatorFiles([]); setShowSimulatorModal(true); }}>Sửa Album</button>
                        <button className="delete-sub-btn" onClick={() => deleteSimulator(s.id)}>Xóa Sạch</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* --- TAB CONFIGS --- */}
        {activeTab === "configs" && (
          <div>
            <h2>🛠️ Cấu Hình Nội Dung Toàn Trang Chủ</h2>
            <form onSubmit={saveConfigs} className="admin-form-box" style={{ maxWidth: "800px" }}>
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Tên Thương Hiệu</label>
                  <input type="text" value={configs.brand_name} onChange={(e) => setConfigs({ ...configs, brand_name: e.target.value })} />
                </div>
                <div>
                  <label>Hotline Gọi Điện</label>
                  <input type="text" value={configs.contact_phone} onChange={(e) => setConfigs({ ...configs, contact_phone: e.target.value })} />
                </div>
                <div>
                  <label>Số Zalo Tư Vấn</label>
                  <input type="text" value={configs.contact_zalo} onChange={(e) => setConfigs({ ...configs, contact_zalo: e.target.value })} />
                </div>
                <div>
                  <label>Email Liên Hệ</label>
                  <input type="email" value={configs.contact_email} onChange={(e) => setConfigs({ ...configs, contact_email: e.target.value })} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label>Địa Chỉ Văn Phòng</label>
                  <input type="text" value={configs.contact_address} onChange={(e) => setConfigs({ ...configs, contact_address: e.target.value })} />
                </div>
                <div>
                  <label>Màu Đậm Chủ Đạo (Primary)</label>
                  <input type="color" value={configs.color_primary} onChange={(e) => setConfigs({ ...configs, color_primary: e.target.value })} style={{ height: "40px", padding: 0 }} />
                </div>
                <div>
                  <label>Màu Nhạt Phụ (Secondary)</label>
                  <input type="color" value={configs.color_secondary} onChange={(e) => setConfigs({ ...configs, color_secondary: e.target.value })} style={{ height: "40px", padding: 0 }} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label>Dòng Chữ Chạy Hero Tag</label>
                  <input type="text" value={configs.hero_tag} onChange={(e) => setConfigs({ ...configs, hero_tag: e.target.value })} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label>Tiêu Đề Lớn Banner (Chấp nhận thẻ &lt;br&gt;, &lt;em&gt;)</label>
                  <textarea rows={3} value={configs.hero_title} onChange={(e) => setConfigs({ ...configs, hero_title: e.target.value })} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label>Đoạn Giới Thiệu Banner Phụ (Hero Subtitle)</label>
                  <textarea rows={3} value={configs.hero_sub} onChange={(e) => setConfigs({ ...configs, hero_sub: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="save-btn" style={{ marginTop: "1.5rem" }} disabled={isSavingConfigs}>
                {isSavingConfigs ? "⏳ Đang Lưu Cấu Hình..." : "💾 Lưu Thay Đổi Giao Diện"}
              </button>
            </form>
          </div>
        )}

        {/* --- TAB RECRUITMENT --- */}
        {activeTab === "recruitment" && (
          <div>
            <h2>💼 Danh Sách Thợ Hồ Sơ Ứng Tuyển Tuyển Dụng</h2>
            {loadingRecruitment ? <p>Đang tải...</p> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ngày Ứng Tuyển</th>
                    <th>Thông Tin Thợ</th>
                    <th>Vị Trí Ứng Tuyển</th>
                    <th>Kinh Nghiệm / Tay Nghề</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recruitmentList.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontSize: "0.85rem" }}>{r.created_at ? new Date(r.created_at).toLocaleString("vi-VN") : "—"}</td>
                      <td>
                        <strong>{r.name}</strong>
                        <div>📞 <a href={`tel:${r.phone}`} style={{ textDecoration: "underline" }}>{r.phone}</a></div>
                        <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>📍 {r.area || "Không rõ khu vực"}</div>
                      </td>
                      <td><span className="badge" style={{ background: "#4caf50", color: "#fff" }}>{r.role || "Thợ Thạch Cao"}</span></td>
                      <td style={{ fontSize: "0.9rem", maxWidth: "300px" }}>{r.experience || "Chưa cập nhật"}</td>
                      <td>
                        <button className="delete-sub-btn" onClick={() => deleteRecruit(r.id)}>Xóa bỏ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL ĐỔI MẬT KHẨU ================= */}
      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>🔑 Đổi Mật Khẩu Quản Trị Viên</h3>
            <form onSubmit={handleChangePassword}>
              <label>Mật khẩu mới</label>
              <input type="password" required value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} placeholder="Tối thiểu 6 ký tự" />
              <label>Xác nhận mật khẩu mới</label>
              <input type="password" required value={passwordForm.confirm_password} onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })} placeholder="Nhập lại mật khẩu mới" />
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowPasswordModal(false)}>Hủy</button>
                <button type="submit" className="save-btn" disabled={isSavingPassword}>
                  {isSavingPassword ? "Đang lưu..." : "Cập Nhật Mật Khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL GALLERY ================= */}
      {showGalleryModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: "550px" }}>
            <h3>{galleryForm.id ? "✏️ Sửa Công Trình" : "➕ Thêm Công Trình Mới"}</h3>
            <form onSubmit={saveGallery}>
              <label>Tiêu đề công trình</label>
              <input type="text" required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} placeholder="Ví dụ: Trần thạch cao giật cấp căn hộ" />
              
              <label>Hạng mục thi công</label>
              <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}>
                <option value="Trần thạch cao phòng khách">Trần thạch cao phòng khách</option>
                <option value="Trần thạch cao phòng ngủ">Trần thạch cao phòng ngủ</option>
                <option value="Vách ngăn thạch cao">Vách ngăn thạch cao cách âm</option>
                <option value="Trần thả văn phòng">Trần thả / Trần nổi văn phòng</option>
              </select>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label>Vị trí (Quận/Huyện)</label>
                  <input type="text" value={galleryForm.location} onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })} placeholder="Quận 7, TP.HCM" />
                </div>
                <div>
                  <label>Diện tích công trình</label>
                  <input type="text" value={galleryForm.size} onChange={(e) => setGalleryForm({ ...galleryForm, size: e.target.value })} placeholder="120m²" />
                </div>
              </div>

              <label>Tải ảnh công trình (Có thể chọn nhiều ảnh cùng lúc)</label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} />

              {/* Xem và xóa các ảnh cũ đã tải lên */}
              {galleryForm.image && (
                <div style={{ marginTop: "1rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Ảnh hiện tại (Bấm vào nút x để xóa bớt):</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "0.4rem" }}>
                    {galleryForm.image.split("|").filter(Boolean).map((img, idx) => (
                      <div key={idx} style={{ position: "relative", width: "70px", height: "55px" }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                        <button type="button" onClick={() => handleDeleteSubImage(idx)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white", border: "none", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer" }}>x</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowGalleryModal(false)}>Hủy đóng</button>
                <button type="submit" className="save-btn" disabled={isSavingGallery}>
                  {isSavingGallery ? "⏳ Đang tải ảnh lên..." : "Lưu Công Trình"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL REVIEWS ================= */}
      {showReviewModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>{reviewForm.id ? "✏️ Sửa Đánh Giá" : "➕ Thêm Đánh Giá Mới"}</h3>
            <form onSubmit={saveReview}>
              <label>Tên khách hàng</label>
              <input type="text" required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} />
              <label>Chức vụ / Vai trò</label>
              <input type="text" value={reviewForm.role} onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })} placeholder="Chủ căn hộ Vinhomes" />
              <label>Dự án thực hiện</label>
              <input type="text" value={reviewForm.project} onChange={(e) => setReviewForm({ ...reviewForm, project: e.target.value })} placeholder="Căn hộ 80m2" />
              <label>Số sao đánh giá</label>
              <select value={reviewForm.stars} onChange={(e) => setReviewForm({ ...reviewForm, stars: parseInt(e.target.value) })}>
                <option value={5}>5 Sao ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Sao ⭐⭐⭐⭐</option>
              </select>
              <label>Nội dung nhận xét</label>
              <textarea rows={3} required value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} />
              <label>Ảnh đại diện khách hàng</label>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowReviewModal(false)}>Hủy</button>
                <button type="submit" className="save-btn" disabled={isSavingReview}>
                  {isSavingReview ? "Đang xử lý..." : "Lưu Đánh Giá"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL MATERIALS ================= */}
      {showMaterialModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>{materialForm.id ? "✏️ Sửa Vật Liệu" : "➕ Thêm Vật Liệu Mới"}</h3>
            <form onSubmit={saveMaterial}>
              <label>Thương hiệu sản xuất</label>
              <input type="text" required value={materialForm.brand} onChange={(e) => setMaterialForm({ ...materialForm, brand: e.target.value })} placeholder="Vĩnh Tường / Knauf" />
              <label>Tên sản phẩm vật liệu</label>
              <input type="text" required value={materialForm.name} onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })} placeholder="Tấm thạch cao chống ẩm dày 9.5mm" />
              <label>Mô tả công dụng đặc tính</label>
              <textarea rows={2} value={materialForm.desc} onChange={(e) => setMaterialForm({ ...materialForm, desc: e.target.value })} />
              <label>Các thẻ Tag (Ngăn cách bằng dấu gạch đứng |)</label>
              <input type="text" value={materialForm.tags} onChange={(e) => setMaterialForm({ ...materialForm, tags: e.target.value })} placeholder="Chống ẩm|Thanh C|Mạ kẽm" />
              <label>Icon hiển thị đại diện</label>
              <input type="text" value={materialForm.icon} onChange={(e) => setMaterialForm({ ...materialForm, icon: e.target.value })} style={{ width: "80px" }} />

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowMaterialModal(false)}>Hủy</button>
                <button type="submit" className="save-btn" disabled={isSavingMaterial}>Lưu Sản Phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL SIMULATOR 3D ================= */}
      {showSimulatorModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: "520px" }}>
            <h3>🎮 Thiết Lập Album Giả Lập Không Gian 3D</h3>
            <form onSubmit={saveSimulator}>
              <label>Chọn Không Gian Phòng Cần Cấu Hình</label>
              <select value={simulatorForm.room_name} onChange={(e) => setSimulatorForm({ ...simulatorForm, room_name: e.target.value })} disabled={!!simulatorForm.id}>
                {SIMULATOR_ROOMS.map((room, idx) => (
                  <option key={idx} value={room}>{room}</option>
                ))}
              </select>

              <label style={{ marginTop: "1rem", display: "block" }}>Chọn thêm ảnh góc nhìn thực tế cho không gian này</label>
              <input type="file" multiple accept="image/*" onChange={handleSimulatorFileChange} />

              {simulatorForm.image && (
                <div style={{ marginTop: "1rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Tập ảnh góc nhìn hiện tại trong phòng:</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "0.4rem" }}>
                    {simulatorForm.image.split("|").filter(Boolean).map((img, idx) => (
                      <div key={idx} style={{ position: "relative", width: "70px", height: "55px" }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                        <button type="button" onClick={() => handleDeleteSimSubImage(idx)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white", border: "none", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer" }}>x</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowSimulatorModal(false)}>Hủy bỏ</button>
                <button type="submit" className="save-btn" disabled={isSavingSimulator}>
                  {isSavingSimulator ? "⏳ Đang tải ảnh lên..." : "Cập Nhật Không Gian 3D"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}