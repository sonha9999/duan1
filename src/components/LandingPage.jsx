// src/components/LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient"; // Kết nối trực tiếp tới Supabase
import "../LandingPage.css";

const CAT_EMOJI = {
  "Căn Hộ": "🏙️",
  "Văn Phòng": "🏢",
  "Biệt Thự": "🏠",
  "Khách Sạn": "🏨",
  "Thương Mại": "🏪",
  "Nhà Phố": "🏘️",
  Khác: "🏗️",
};

const FALLBACK_BG = [
  "linear-gradient(135deg,#1a2035,#0d1520)",
  "linear-gradient(135deg,#201a10,#150f05)",
  "linear-gradient(135deg,#0d2020,#051510)",
];

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

// Cấu hình số lượng hiển thị mặc định
const GALLERY_LIMIT = 6;  // 3 cột x 2 hàng
const REVIEWS_LIMIT = 3;   // 3 cột x 1 hàng

// COMPONENT PHÂN TRANG CAO CẤP
function Pagination({ currentPage, totalPages, onPageChange }) {
  const [jumpValue, setJumpValue] = useState("");

  if (totalPages <= 1) return null;

  const handleJump = (e) => {
    e.preventDefault();
    const p = parseInt(jumpValue);
    if (p >= 1 && p <= totalPages) {
      onPageChange(p);
      setJumpValue("");
    } else {
      alert(`Vui lòng nhập số trang từ 1 đến ${totalPages}`);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        marginTop: "2.5rem",
        flexWrap: "wrap",
      }}
    >
      {/* Nút lùi trang ‹ (ẨN KHI ĐANG Ở TRANG 1) */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="filter-btn"
          style={{ padding: "0.4rem 0.8rem", minWidth: "36px" }}
          title="Trang trước"
        >
          ‹
        </button>
      )}

      {/* Hiển thị các số trang */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`filter-btn ${currentPage === p ? "active" : ""}`}
          style={{
            minWidth: "36px",
          }}
        >
          {p}
        </button>
      ))}

      {/* Nút Nhảy về Trang Cuối (ẨN KHI ĐANG Ở TRANG CUỐI) */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="filter-btn"
          style={{ padding: "0.4rem 0.8rem" }}
          title="Trang cuối"
        >
          Cuối
        </button>
      )}

      {/* Nút tiến trang › (ẨN KHI ĐANG Ở TRANG CUỐI) */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="filter-btn"
          style={{ padding: "0.4rem 0.8rem", minWidth: "36px" }}
          title="Trang kế tiếp"
        >
          ›
        </button>
      )}

      {/* Ô nhảy nhanh trang */}
      <form
        onSubmit={handleJump}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          marginLeft: "0.5rem",
        }}
      >
        <input
          type="number"
          placeholder="Trang"
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          style={{
            width: "60px",
            background: "var(--c2)",
            border: "1px solid var(--line)",
            color: "var(--text)",
            padding: "0.4rem 0.5rem",
            borderRadius: "999px",
            fontSize: "0.8rem",
            textAlign: "center",
            outline: "none",
          }}
        />
        <button
          type="submit"
          className="filter-btn"
          style={{
            padding: "0.4rem 0.8rem",
            background: "rgba(232, 160, 32, 0.12)",
            color: "var(--accent)",
            borderColor: "rgba(232, 160, 32, 0.2)",
          }}
        >
          Đi
        </button>
      </form>
    </div>
  );
}

export default function LandingPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [content, setContent] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeGalleryProject, setActiveGalleryProject] = useState(null);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // States quản lý trang hiện tại (Pagination)
  const [galleryPage, setGalleryPage] = useState(1);
  const [materialsPage, setMaterialsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);

  // States quản lý ô Tìm kiếm (Search)
  const [gallerySearch, setGallerySearch] = useState("");
  const [materialsSearch, setMaterialsSearch] = useState("");
  const [reviewsSearch, setReviewsSearch] = useState("");

  // States quản lý thanh Menu (Scrollspy)
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // States quản lý việc rê chuột vào vùng đọc thông tin (Pause Autoplay)
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [isMaterialsHovered, setIsMaterialsHovered] = useState(false);
  const [isReviewsHovered, setIsReviewsHovered] = useState(false);

  // State quản lý số lượng vật liệu hiển thị theo kích thước màn hình (Responsive Limit)
  const [materialsLimit, setMaterialsLimit] = useState(8);

  // States quản lý hồ sơ ứng tuyển Tuyển Dụng
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [recruitForm, setRecruitForm] = useState({
    name: "",
    phone: "",
    position: "",
    experience: "",
  });

  const [calcParams, setCalcParams] = useState({
    svc: 95000,
    area: 50,
    mat: 1.0,
    build: 1.0,
  });
  const [calcResult, setCalcResult] = useState("4.750.000đ");

  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    area: "",
    address: "",
    note: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // HÀM CHUYỂN ĐỔI CHỮ LOGO THÔNG MINH (ĐỌC TỪ ADMIN ĐỂ PHÂN MÀU VÀNG Ở ĐUÔI)
  const renderLogoText = (text) => {
    const defaultLogo = <>Thạch<span>Pro</span></>;
    if (!text) return defaultLogo;
    
    const trimmed = text.trim();
    
    // 1. Trường hợp dính liền có chữ viết hoa ở giữa (Ví dụ: ThạchPro)
    const capIndices = [];
    for (let i = 1; i < trimmed.length; i++) {
      if (trimmed[i] === trimmed[i].toUpperCase() && trimmed[i] !== " " && isNaN(trimmed[i])) {
        capIndices.push(i);
      }
    }
    
    if (capIndices.length > 0 && !trimmed.includes(" ")) {
      const splitIdx = capIndices[0];
      const part1 = trimmed.slice(0, splitIdx);
      const part2 = trimmed.slice(splitIdx);
      return <>{part1}<span>{part2}</span></>;
    }

    // 2. Trường hợp có khoảng trắng (Ví dụ: thach kinh thien)
    const words = trimmed.split(" ");
    if (words.length > 1) {
      const lastWord = words[words.length - 1];
      const firstPart = words.slice(0, words.length - 1).join(" ");
      return <>{firstPart} <span>{lastWord}</span></>;
    }

    // 3. Nếu chỉ có đúng 1 từ viết thường
    return <>{trimmed}</>;
  };

  // Tự động nhận diện màn hình điện thoại để rút gọn danh mục Vật Liệu còn 4 mục/trang
  useEffect(() => {
    const updateMaterialsLimit = () => {
      if (window.innerWidth <= 768) {
        setMaterialsLimit(4); // Điện thoại: Chỉ hiển thị 4 vật liệu
      } else {
        setMaterialsLimit(8); // Máy tính: Hiển thị 8 vật liệu
      }
    };
    updateMaterialsLimit();
    window.addEventListener("resize", updateMaterialsLimit);
    return () => window.removeEventListener("resize", updateMaterialsLimit);
  }, []);

  // Bộ lắng nghe cuộn màn hình để tự động tô màu Menu (Scrollspy)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["services", "gallery", "calc", "materials", "reviews", "contact"];
      const scrollPosition = window.scrollY + 250;

      let currentSection = "";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);

      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const cur = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cur) {
        cur.style.left = mx + "px";
        cur.style.top = my + "px";
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    const animLoop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      requestAnimationFrame(animLoop);
    };
    const animId = requestAnimationFrame(animLoop);

    // Tải dữ liệu trực tiếp từ Supabase thay vì Google Sheets
    async function loadDataFromSupabase() {
      setLoadingGallery(true);
      try {
        // 1. Tải danh sách công trình
        const { data: galleryData, error: galleryErr } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (!galleryErr && galleryData) {
          setGalleryItems(galleryData);
          setFilteredItems(galleryData);
        }

        // 2. Tải danh sách đánh giá khách hàng (Cộng dồn thông minh và tải ảnh đại diện Avatar)
        const { data: reviewsData, error: reviewsErr } = await supabase
          .from("reviews")
          .select("*");
        
        const dbReviews = reviewsData || [];
        const combinedReviews = DEFAULT_REVIEWS.map(def => {
          const edited = dbReviews.find(db => db.id === def.id);
          return edited ? edited : def;
        });
        const newlyAddedReviews = dbReviews.filter(db => !DEFAULT_REVIEWS.some(def => def.id === db.id));
        setReviews([...combinedReviews, ...newlyAddedReviews]);

        // 3. Tải danh sách vật liệu (Cộng dồn thông minh)
        const { data: materialsData, error: materialsErr } = await supabase
          .from("materials")
          .select("*");
        
        const dbMaterials = materialsData || [];
        const combinedMaterials = DEFAULT_MATERIALS.map(def => {
          const edited = dbMaterials.find(db => db.id === def.id);
          return edited ? edited : def;
        });
        const newlyAddedMaterials = dbMaterials.filter(db => !DEFAULT_MATERIALS.some(def => def.id === db.id));
        setMaterials([...combinedMaterials, ...newlyAddedMaterials]);

        // 4. Tải cấu hình chữ (Content) lưu trữ trên Supabase
        const { data: contentData } = await supabase
          .from("content")
          .select("*");
        
        if (contentData && contentData.length > 0) {
          const obj = {};
          contentData.forEach((item) => (obj[item.key] = item.value));
          setContent(obj);
        }
      } catch (err) {
        console.error("Lỗi khi kết nối dữ liệu Supabase:", err);
        setMaterials(DEFAULT_MATERIALS);
      } finally {
        setLoadingGallery(false);
      }
    }

    loadDataFromSupabase();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    setGalleryPage(1); // Reset số trang về 1 khi đổi danh mục lọc
    if (cat === "all") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter((i) => i.category === cat));
    }
  };

  const handleCalc = (key, val) => {
    const updated = { ...calcParams, [key]: Number(val) };
    setCalcParams(updated);
    if (updated.svc === 0) {
      setCalcResult("Liên hệ báo giá");
    } else {
      const total = Math.round(
        updated.svc * updated.area * updated.mat * updated.build
      );
      setCalcResult(total.toLocaleString("vi-VN") + "đ");
    }
  };

  // Gửi thông tin khách hàng trực tiếp lên Supabase
  const submitContact = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      alert("Vui lòng nhập Họ tên và Số điện thoại!");
      return;
    }
    setContactLoading(true);
    try {
      const { error } = await supabase
        .from("contacts")
        .insert([
          {
            name: contactForm.name,
            phone: contactForm.phone,
            email: contactForm.email,
            service: contactForm.service,
            area: contactForm.area,
            address: contactForm.address,
            note: contactForm.note,
          }
        ]);

      if (error) throw error;

      setContactSuccess(true);
      setContactForm({
        name: "",
        phone: "",
        email: "",
        service: "",
        area: "",
        address: "",
        note: "",
      });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      console.error("Lỗi lưu liên hệ khách hàng:", err);
      alert("Có lỗi xảy ra khi gửi thông tin, vui lòng thử lại.");
    } finally {
      setContactLoading(false);
    }
  };

  // Gửi hồ sơ đăng ký Ứng Tuyển Tuyển Dụng
  const submitRecruitment = async (e) => {
    e.preventDefault();
    if (!recruitForm.name || !recruitForm.phone || !recruitForm.position) {
      alert("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Vị trí mong muốn ứng tuyển!");
      return;
    }
    try {
      const { error } = await supabase.from("recruitment").insert([
        {
          name: recruitForm.name,
          phone: recruitForm.phone,
          position: recruitForm.position,
          experience: recruitForm.experience,
        }
      ]);
      if (error) throw error;
      alert("Nộp hồ sơ ứng tuyển thành công! ThạchPro sẽ liên hệ trao đổi trực tiếp với bạn sớm nhất.");
      setShowRecruitModal(false);
      setRecruitForm({ name: "", phone: "", position: "", experience: "" });
    } catch {
      alert("Có lỗi xảy ra khi nộp hồ sơ, vui lòng thử lại sau.");
    }
  };

  // 1. Logic lọc tìm kiếm Công trình (Gallery)
  const searchedGallery = filteredItems.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(gallerySearch.toLowerCase());
    const locMatch = item.location && item.location.toLowerCase().includes(gallerySearch.toLowerCase());
    return titleMatch || locMatch;
  });
  const totalGalleryPages = Math.ceil(searchedGallery.length / GALLERY_LIMIT);
  const currentGalleryItems = searchedGallery.slice(
    (galleryPage - 1) * GALLERY_LIMIT,
    galleryPage * GALLERY_LIMIT
  );

  // 2. Logic lọc tìm kiếm Vật liệu (Tối ưu số lượng limit theo thiết bị)
  const searchedMaterials = materials.filter((mat) => {
    const nameMatch = mat.name.toLowerCase().includes(materialsSearch.toLowerCase());
    const brandMatch = mat.brand.toLowerCase().includes(materialsSearch.toLowerCase());
    const tagMatch = mat.tags && mat.tags.toLowerCase().includes(materialsSearch.toLowerCase());
    return nameMatch || brandMatch || tagMatch;
  });
  const totalMaterialsPages = Math.ceil(searchedMaterials.length / materialsLimit);
  const currentMaterials = searchedMaterials.slice(
    (materialsPage - 1) * materialsLimit,
    materialsPage * materialsLimit
  );

  // 3. Logic lọc tìm kiếm Đánh giá (Reviews)
  const searchedReviews = reviews.filter((rev) => {
    const nameMatch = rev.name.toLowerCase().includes(reviewsSearch.toLowerCase());
    const textMatch = rev.text.toLowerCase().includes(reviewsSearch.toLowerCase());
    const projMatch = rev.project && rev.project.toLowerCase().includes(reviewsSearch.toLowerCase());
    return nameMatch || textMatch || projMatch;
  });
  const totalReviewsPages = Math.ceil(searchedReviews.length / REVIEWS_LIMIT);
  const currentReviews = searchedReviews.slice(
    (reviewsPage - 1) * REVIEWS_LIMIT,
    reviewsPage * REVIEWS_LIMIT
  );

  // ==========================================
  // HỆ THỐNG HẸN GIỜ TỰ ĐỘNG CHUYỂN TRANG THÔNG MINH
  // ==========================================
  
  // 1. Tự động chuyển trang cho phần Công Trình (Gallery)
  useEffect(() => {
    if (totalGalleryPages <= 1 || isGalleryHovered) return;
    const interval = setInterval(() => {
      setGalleryPage((prev) => (prev >= totalGalleryPages ? 1 : prev + 1));
    }, 10000); 
    return () => clearInterval(interval);
  }, [totalGalleryPages, isGalleryHovered]);

  // 2. Tự động chuyển trang cho phần Vật Liệu
  useEffect(() => {
    if (totalMaterialsPages <= 1 || isMaterialsHovered) return;
    const interval = setInterval(() => {
      setMaterialsPage((prev) => (prev >= totalMaterialsPages ? 1 : prev + 1));
    }, 10000); 
    return () => clearInterval(interval);
  }, [totalMaterialsPages, isMaterialsHovered]);

  // 3. Tự động chuyển trang cho phần Đánh Giá (Reviews)
  useEffect(() => {
    if (totalReviewsPages <= 1 || isReviewsHovered) return;
    const interval = setInterval(() => {
      setReviewsPage((prev) => (prev >= totalReviewsPages ? 1 : prev + 1));
    }, 10000); 
    return () => clearInterval(interval);
  }, [totalReviewsPages, isReviewsHovered]);


  return (
    <>
      {/* KHU VỰC CSS SỬA LỖI ĐỘ ƯU TIÊN VÀ HIGHLIGHT CHO MENU/ PHÂN TRANG */}
      <style>{`
        .nav-center a.active {
          color: var(--accent) !important;
        }
        .nav-center a.active::after {
          width: 100% !important;
          left: 0 !important;
        }
        .filter-btn.active {
          background: var(--accent) !important;
          border-color: var(--accent) !important;
          color: var(--c0) !important;
          box-shadow: 0 0 12px var(--accent) !important;
        }
        /* NÂNG CẤP: Tự động xuống dòng danh mục lọc công trình trên di động */
        @media (max-width: 768px) {
          .gallery-filters {
            overflow-x: visible !important;
            white-space: normal !important;
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
            gap: 0.6rem !important;
            padding-bottom: 0 !important;
          }
          .filter-btn {
            flex-shrink: 1 !important;
          }
        }
      `}</style>

      <div id="cursor"></div>
      <div id="cursor-ring"></div>

      {/* HEADER NAV */}
      <nav id="nav" className={isScrolled ? "scrolled" : ""}>
        <a href="#" className="logo-wrap">
          {content.logo_image ? (
            <img src={content.logo_image} alt="Logo" style={{ height: "40px", width: "40px", objectFit: "cover", borderRadius: "6px" }} />
          ) : (
            <div className="logo-icon">🏠</div>
          )}
          {/* Tên thương hiệu TỰ ĐỘNG PHÂN CHIA TÔNG MÀU THÔNG MINH */}
          <span className="logo-text">
            {renderLogoText(content.brand_name)}<span>.</span>
          </span>
        </a>
        <ul className="nav-center">
          <li>
            <a href="#services" className={activeSection === "services" ? "active" : ""}>Dịch Vụ</a>
          </li>
          <li>
            <a href="#gallery" className={activeSection === "gallery" ? "active" : ""}>Công Trình</a>
          </li>
          <li>
            <a href="#calc" className={activeSection === "calc" ? "active" : ""}>Báo Giá</a>
          </li>
          <li>
            <a href="#materials" className={activeSection === "materials" ? "active" : ""}>Vật Liệu</a>
          </li>
          <li>
            <a href="#reviews" className={activeSection === "reviews" ? "active" : ""}>Đánh Giá</a>
          </li>
          <li>
            <a href="#contact" className={activeSection === "contact" ? "active" : ""}>Liên Hệ</a>
          </li>
          {/* Nút Tuyển Dụng Thợ */}
          <li>
            <a href="#recruit" onClick={(e) => { e.preventDefault(); setShowRecruitModal(true); }} style={{ color: "var(--accent)", fontWeight: 700 }}>Tuyển Thợ 🇻🇳</a>
          </li>
        </ul>
        <div className="nav-right">
          <a
            href={`tel:${content.contact_phone || "0901234567"}`}
            className="nav-phone"
          >
            📞 {content.contact_phone || "0901 234 567"}
          </a>
          <a href="#contact" className="btn-nav">
            Liên Hệ Ngay
          </a>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div id="mobile-menu" className={mobileMenuOpen ? "open" : ""}>
        <button
          className="mobile-close"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>
        <a href="#services" onClick={() => setMobileMenuOpen(false)}>
          Dịch Vụ
        </a>
        <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>
          Công Trình
        </a>
        <a href="#calc" onClick={() => setMobileMenuOpen(false)}>
          Báo Giá
        </a>
        <a href="#materials" onClick={() => setMobileMenuOpen(false)}>
          Vật Liệu
        </a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
          Liên Hệ
        </a>
        <a href="#recruit" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setShowRecruitModal(true); }} style={{ color: "var(--accent)" }}>
          Tuyển Thợ 🇻🇳
        </a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-orb"></div>
        <div className="hero-orb2"></div>
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-tag">
              <span className="dot"></span>{" "}
              {content.hero_tag || "Đang nhận dự án — TP.HCM & Bình Dương"}
            </div>
            <h1
              className="hero-title"
              dangerouslySetInnerHTML={{
                __html:
                  content.hero_title ||
                  "Kiến Tạo<br>Không Gian<br><em>Hoàn Hảo</em>",
              }}
            ></h1>
            <p className="hero-sub">
              {content.hero_sub ||
                "Đơn vị thi công thạch cao hàng đầu tại TP.HCM — trần giật cấp, vách ngăn, phào chỉ trang trí. Cung cấp vật liệu xây dựng cao cấp Knauf, USG chính hãng, giao tận công trình."}
            </p>
            <div className="hero-btns">
              <a href="#calc" className="btn-primary">
                {content.hero_btn1 || "→ Nhận Báo Giá Miễn Phí"}
              </a>
              <a href="#gallery" className="btn-ghost">
                {content.hero_btn2 || "Xem Công Trình →"}
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="stat-box">
              <div className="stat-num">500+</div>
              <div className="stat-lbl">{content.stat1_lbl || "Công trình hoàn thành"}</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{content.about_years || "15"}+</div>
              <div className="stat-lbl">{content.stat2_lbl || "Năm kinh nghiệm"}</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">98%</div>
              <div className="stat-lbl">{content.stat3_lbl || "Khách hàng hài lòng"}</div>
            </div>
          </div>
        </div>
        <div className="scroll-ind">
          <span>Cuộn xuống</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          <div className="ticker-track">
            {Array(2)
              .fill([
                "Trần Thạch Cao Phẳng",
                "Trần Giật Cấp",
                "Vách Ngăn Nhẹ",
                "Phào Chỉ Trang Trí",
                "Knauf · USG · Vĩnh Tường",
                "Khung Thép Mạ Kẽm",
                "Bả Bột & Sơn Nước",
                "Bảo Hành 24 Tháng",
              ])
              .flat()
              .map((text, idx) => (
                <div key={idx} className="ticker-item">
                  {text} <span className="ticker-sep">✦</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services">
        <div className="services-head">
          <div>
            <div className="sec-eyebrow">Dịch Vụ</div>
            <h2 className="sec-title">
              Thi Công Toàn Diện
              <br />
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                Đúng Chất Lượng
              </em>
            </h2>
          </div>
          <p className="sec-desc">
            Đội thợ lành nghề 10+ năm kinh nghiệm. Cam kết tiến độ, chất lượng
            bề mặt mịn phẳng tiêu chuẩn, bảo hành dài hạn.
          </p>
        </div>
        <div className="svc-grid">
          {[
            {
              n: "01",
              ico: "🏛️",
              name: "Trần Thạch Cao Phẳng",
              desc: "Thi công trần phẳng khung nổi & khung chìm. Bề mặt phẳng mịn tuyệt đối, che đường điện, điều hoà gọn gàng. Phù hợp căn hộ, văn phòng, nhà dân.",
              price: "Từ 95.000đ/m²",
            },
            {
              n: "02",
              ico: "✨",
              name: "Trần Giật Cấp Nghệ Thuật",
              desc: "Thiết kế và thi công trần giật cấp 2–4 tầng, tích hợp hệ đèn LED âm trần, cắt chỉ nổi. Tạo chiều sâu không gian và điểm nhấn sang trọng.",
              price: "Từ 145.000đ/m²",
            },
            {
              n: "03",
              ico: "🪟",
              name: "Vách Ngăn Thạch Cao",
              desc: "Vách ngăn khung thép mạ kẽm, tấm thạch cao tiêu chuẩn hoặc chống ẩm. Cách âm, cách nhiệt vượt trội. Linh hoạt bố cục không gian sống.",
              price: "Từ 180.000đ/m²",
            },
            {
              n: "04",
              ico: "🎨",
              name: "Phào Chỉ & Trang Trí",
              desc: "Thi công phào chỉ thạch cao ốp tường, trần. Hoa văn cổ điển đến hiện đại, phào góc bo, gờ nổi. Hoàn thiện chi tiết tinh xảo.",
              price: "Từ 120.000đ/md",
            },
            {
              n: "05",
              ico: "🖌️",
              name: "Bả Bột & Sơn Nước",
              desc: "Bả Matit 2–3 lớp, xử lý bề mặt trơn mịn hoàn hảo. Thi công sơn nước Dulux, Jotun, Kova nội ngoại thất. Màu sắc theo yêu cầu.",
              price: "Từ 55.000đ/m²",
            },
            {
              n: "06",
              ico: "🏗️",
              name: "Cung Cấp Vật Liệu",
              desc: "Phân phối tấm thạch cao Knauf, USG, Vĩnh Tường; khung thép mạ kẽm; bông khoáng; phụ kiện. Giao tận công trình toàn TP.HCM, Bình Dương.",
              price: "Giá sỉ tốt nhất",
            },
          ].map((svc) => (
            <div key={svc.n} className="svc-card">
              <div className="svc-top">
                <div className="svc-ico">{svc.ico}</div>
                <div className="svc-n">{svc.n}</div>
              </div>
              <div className="svc-name">{svc.name}</div>
              <div className="svc-desc">{svc.desc}</div>
              <div className="svc-price">
                {svc.price} <span className="svc-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-visual">
          <div className="about-ring-outer">
            <div className="about-ring-inner">
              <div className="arc-num">{content.about_years || "15"}</div>
              <div className="arc-lbl">
                Năm
                <br />
                Kinh Nghiệm
              </div>
            </div>
          </div>
          <div className="about-badges">
            <div className="badge">Knauf Partner</div>
            <div className="badge">ISO 9001</div>
            <div className="badge">USG Authorized</div>
            <div className="badge">Vĩnh Tường</div>
          </div>
        </div>
        <div className="about-text">
          <div className="sec-eyebrow">Về Chúng Tôi</div>
          <h2 className="sec-title">
            {content.about_title || "Hơn 15  Năm Xây Dựng Niềm Tin"}
          </h2>
          <p className="sec-desc">
            {content.about_desc || "ThạchPro được thành lập lâu năm, đã hoàn thiện hơn 500 công trình từ căn hộ cao cấp, biệt thự, văn phòng đến trung tâm thương mại trên toàn TP.HCM."}
          </p>
          <div className="feat-list">
            <div className="feat">
              <div className="feat-ico">🏆</div>
              <div>
                <div className="feat-title">Đội Ngũ Thợ Chuyên Nghiệp</div>
                <div className="feat-desc">
                  30+ thợ lành nghề với 10+ năm kinh nghiệm. Được đào tạo bài
                  bản theo tiêu chuẩn Knauf & USG.
                </div>
              </div>
            </div>
            <div className="feat">
              <div className="feat-ico">📋</div>
              <div>
                <div className="feat-title">Báo Giá Minh Bạch</div>
                <div className="feat-desc">
                  Không phát sinh chi phí ngoài hợp đồng. Báo giá chi tiết từng
                   mục, vật tư rõ ràng ngay từ đầu.
                </div>
              </div>
            </div>
            <div className="feat">
              <div className="feat-ico">⚡</div>
              <div>
                <div className="feat-title">Tiến Độ Đúng Cam Kết</div>
                <div className="feat-desc">
                  Đảm bảo hoàn thành đúng hạn. Làm sạch công trình hàng ngày,
                  không gây ảnh hưởng đến sinh hoạt.
                </div>
              </div>
            </div>
            <div className="feat">
              <div className="feat-ico">🛡️</div>
              <div>
                <div className="feat-title">Bảo Hành 24 Tháng</div>
                <div className="feat-desc">
                  Cam kết bảo hành toàn bộ hạng mục 24 tháng. Hỗ trợ bảo trì
                  miễn phí sau thời gian bảo hành.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY CÔNG TRÌNH */}
      <section id="gallery">
        <div className="sec-eyebrow">Dự Án Tiêu Biểu</div>
        <h2 className="sec-title">Công Trình Đã Thực Hiện</h2>
        
        {/* Nút lọc và Ô tìm kiếm công trình */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginTop: "1.8rem", marginBottom: "2rem" }}>
          <div className="gallery-filters" style={{ margin: 0 }}>
            {[
              "all",
              "Căn Hộ",
              "Văn Phòng",
              "Biệt Thự",
              "Khách Sạn",
              "Thương Mại",
            ].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => handleFilter(cat)}
              >
                {cat === "all" ? "Tất Cả" : cat}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="🔍 Tìm công trình (tiêu đề, địa điểm...)"
            value={gallerySearch}
            onChange={(e) => { setGallerySearch(e.target.value); setGalleryPage(1); }}
            className="cf-input"
            style={{ maxWidth: "350px", background: "var(--c2)", margin: 0 }}
          />
        </div>

        {loadingGallery ? (
          <div
            id="gallery-loading"
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--muted)",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                animation: "spin 1s linear infinite",
                display: "inline-block",
              }}
            >
              ⟳
            </div>
            <br />
            Đang tải dữ liệu dự án...
          </div>
        ) : searchedGallery.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--muted)",
            }}
          >
            Không tìm thấy công trình phù hợp.
          </div>
        ) : (
          <div 
            onMouseEnter={() => setIsGalleryHovered(true)} 
            onMouseLeave={() => setIsGalleryHovered(false)}
          >
            <div className="gallery-grid" style={{ display: "grid" }}>
              {currentGalleryItems.map((item, idx) => {
                const imageList = item.image ? item.image.split("|") : [];
                const firstImage = imageList[0] || "";
                const hasImg = firstImage.trim() !== "";
                const fallback = FALLBACK_BG[idx % FALLBACK_BG.length];
                const bgStyle = hasImg
                  ? {
                      background: `url(${encodeURI(
                        firstImage
                      )}) center/cover no-repeat`,
                    }
                  : { background: fallback };

                return (
                  <div
                    key={item.id}
                    className="g-item"
                    onClick={() => {
                      setActiveGalleryProject(item);
                      setCurrentPhotoIdx(0);
                    }}
                  >
                    <div className="g-bg" style={bgStyle}>
                      {!hasImg && (CAT_EMOJI[item.category] || "🏗️")}
                    </div>
                    <div className="g-overlay"></div>
                    <div className="g-info">
                      <div className="g-cat">
                        {item.category}{" "}
                        {imageList.length > 1
                          ? `(📸 ${imageList.length} ảnh)`
                          : ""}
                      </div>
                      <div className="g-title">{item.title}</div>
                      <div className="g-area">
                        📍 {item.location || ""}{" "}
                        {item.size ? `· ${item.size}` : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Phân trang tinh gọn */}
            <Pagination
              currentPage={galleryPage}
              totalPages={totalGalleryPages}
              onPageChange={setGalleryPage}
            />
          </div>
        )}
      </section>

      {/* LIGHTBOX SLIDESHOW MODAL */}
      {activeGalleryProject && (
        <div
          className="lightbox-modal"
          onClick={() => setActiveGalleryProject(null)}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setActiveGalleryProject(null)}
            >
              ✕
            </button>
            <div className="lightbox-main-view">
              {activeGalleryProject.image ? (
                <img
                  src={activeGalleryProject.image.split("|")[currentPhotoIdx]}
                  alt=""
                  className="lightbox-img"
                />
              ) : (
                <div className="lightbox-no-img">
                  {CAT_EMOJI[activeGalleryProject.category]}
                </div>
              )}
              {activeGalleryProject.image &&
                activeGalleryProject.image.split("|").length > 1 && (
                  <>
                    <button
                      className="lightbox-prev"
                      onClick={() =>
                        setCurrentPhotoIdx((prev) =>
                          prev === 0
                            ? activeGalleryProject.image.split("|").length - 1
                            : prev - 1
                        )
                      }
                    >
                      ⟨
                    </button>
                    <button
                      className="lightbox-next"
                      onClick={() =>
                        setCurrentPhotoIdx((prev) =>
                          prev ===
                          activeGalleryProject.image.split("|").length - 1
                            ? 0
                            : prev + 1
                        )
                      }
                    >
                      ⟩
                    </button>
                  </>
                )}
            </div>
            <div className="lightbox-footer">
              <div>
                <h3 className="lightbox-title">{activeGalleryProject.title}</h3>
                <p className="lightbox-meta">
                  📍 {activeGalleryProject.location}{" "}
                  {activeGalleryProject.size
                    ? `· ${activeGalleryProject.size}`
                    : ""}
                </p>
              </div>
              {activeGalleryProject.image &&
                activeGalleryProject.image.split("|").length > 1 && (
                  <div className="lightbox-counter">
                    {currentPhotoIdx + 1} /{" "}
                    {activeGalleryProject.image.split("|").length}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR */}
      <section id="calc">
        <div className="sec-eyebrow">Công Cụ</div>
        <h2 className="sec-title">
          Tính Chi Phí{" "}
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
            Ngay & Luôn
          </em>
        </h2>
        <p className="sec-desc" style={{ marginBottom: "4rem" }}>
          Nhập thông tin để nhận ước tính chi phí nhanh. Báo giá chính xác sau
          khi khảo sát thực tế miễn phí.
        </p>
        <div className="calc-wrap">
          <div className="calc-form">
            <div className="calc-title-bar">Thông Tin Công Trình</div>
            <div className="form-row">
              <label className="form-label">Loại Dịch Vụ</label>
              <select
                className="form-select"
                id="svcType"
                onChange={(e) => handleCalc("svc", e.target.value)}
              >
                <option value="95000">
                  Trần Thạch Cao Phẳng (từ 95.000đ/m²)
                </option>
                <option value="145000">Trần Giật Cấp (từ 145.000đ/m²)</option>
                <option value="180000">
                  Vách Ngăn Thạch Cao (từ 180.000đ/m²)
                </option>
                <option value="120000">
                  Phào Chỉ Trang Trí (từ 120.000đ/md)
                </option>
                <option value="55000">Bả Bột & Sơn Nước (từ 55.000đ/m²)</option>
                <option value="0">Trọn Gói Nhiều Hạng Mục</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Diện Tích (m²)</label>
              <div className="range-wrap">
                <div className="range-val">
                  <span>Diện tích</span>
                  <span>{calcParams.area} m²</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="5"
                  value={calcParams.area}
                  onChange={(e) => handleCalc("area", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <label className="form-label">Chất Lượng Vật Liệu</label>
              <select
                className="form-select"
                id="matQ"
                onChange={(e) => handleCalc("mat", e.target.value)}
              >
                <option value="1.0">Tiêu Chuẩn</option>
                <option value="1.3">Cao Cấp (Knauf, USG)</option>
                <option value="1.6">Premium (Chống Ẩm / Chống Cháy)</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Loại Công Trình</label>
              <select
                className="form-select"
                id="buildT"
                onChange={(e) => handleCalc("build", e.target.value)}
              >
                <option value="1.0">Căn Hộ / Nhà Phố</option>
                <option value="1.1">Văn Phòng / Thương Mại</option>
                <option value="1.2">Biệt Thự / Cao Cấp</option>
                <option value="0.95">Nhà Xưởng / Kho Bãi</option>
              </select>
            </div>
            <button
              className="calc-btn"
              onClick={() => handleCalc("area", calcParams.area)}
            >
              🔢 Tính Chi Phí Ngay
            </button>
          </div>
          <div className="calc-result">
            <div className="result-box active">
              <div className="result-label">Ước Tính Chi Phí Nhân Công</div>
              <div className="result-price">{calcResult}</div>
              <div className="result-unit">Chưa bao gồm VAT & vật liệu</div>
              <div className="result-bd">
                <div className="rb-item">
                  <span className="rb-label">Diện tích</span>
                  <span className="rb-val">{calcParams.area} m²</span>
                </div>
                <div className="rb-item">
                  <span className="rb-label">Đơn giá nhân công</span>
                  <span className="rb-val">
                    {calcParams.svc === 0
                      ? "Liên hệ"
                      : calcParams.svc.toLocaleString("vi-VN") + "đ/m²"}
                  </span>
                </div>
                <div className="rb-item">
                  <span className="rb-label">Hệ số vật liệu</span>
                  <span className="rb-val">× {calcParams.mat}</span>
                </div>
                <div className="rb-item">
                  <span className="rb-label">Hệ số công trình</span>
                  <span className="rb-val">× {calcParams.build}</span>
                </div>
                <div className="rb-div"></div>
                <div className="rb-item rb-total">
                  <span className="rb-label">Tổng ước tính</span>
                  <span className="rb-val">{calcResult}</span>
                </div>
              </div>
            </div>
            <div className="calc-note">
              <strong>⚠️ Lưu ý:</strong> Đây là ước tính tham khảo. Chi phí thực
              tế phụ thuộc vào hiện trạng công trình và độ phức tạp thiết kế.{" "}
              <strong>
                Liên hệ để được khảo sát và báo giá chính xác miễn phí.
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* MATERIALS */}
      <section id="materials">
        <div className="sec-eyebrow">Vật Liệu</div>
        <h2 className="sec-title">Nguồn Hàng Chính Hãng</h2>
        
        {/* Ô tìm kiếm vật liệu */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="🔍 Tìm vật liệu (tên, hãng, nhãn...)"
            value={materialsSearch}
            onChange={(e) => { setMaterialsSearch(e.target.value); setMaterialsPage(1); }}
            className="cf-input"
            style={{ maxWidth: "350px", background: "var(--c2)", margin: 0 }}
          />
        </div>

        {searchedMaterials.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
            Không tìm thấy vật liệu phù hợp.
          </div>
        ) : (
          <div 
            onMouseEnter={() => setIsMaterialsHovered(true)} 
            onMouseLeave={() => setIsMaterialsHovered(false)}
          >
            <div className="mat-grid" style={{ display: "grid" }}>
              {currentMaterials.map((mat) => (
                <div key={mat.id || mat.name} className="mat-card">
                  <div className="mat-ico-big">{mat.icon}</div>
                  <div className="mat-brand">{mat.brand}</div>
                  <div className="mat-name">{mat.name}</div>
                  <div className="mat-desc">{mat.desc}</div>
                  <div className="mat-tags">
                    {mat.tags &&
                      mat.tags.split("|").map((tag, tIdx) => (
                        <span key={tIdx} className="mat-tag">
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={materialsPage}
              totalPages={totalMaterialsPages}
              onPageChange={setMaterialsPage}
            />
          </div>
        )}
      </section>

      {/* PROCESS */}
      <section id="process">
        <div style={{ textAlign: "center" }}>
          <div className="sec-eyebrow" style={{ justifyContent: "center" }}>
            Quy Trình
          </div>
          <h2 className="sec-title">5 Bước Đến Công Trình Hoàn Hảo</h2>
        </div>
        <div className="process-grid">
          {[
            {
              num: "01",
              ico: "📞",
              name: "Liên Hệ & Tư Vấn",
              desc: "Gọi hotline hoặc nhắn Zalo. Tư vấn sơ bộ giải pháp và vật liệu phù hợp.",
            },
            {
              num: "02",
              ico: "📐",
              name: "Khảo Sát Miễn Phí",
              desc: "Đội kỹ thuật đến đo đạc, đánh giá thực tế trong 24 giờ. Hoàn toàn miễn phí.",
            },
            {
              num: "03",
              ico: "📋",
              name: "Báo Giá & Ký HĐ",
              desc: "Báo giá chi tiết từng hạng mục. Ký hợp đồng cam kết tiến độ & chất lượng.",
            },
            {
              num: "04",
              ico: "⚒️",
              name: "Thi Công Chuyên Nghiệp",
              desc: "Đội thợ làm việc đúng tiến độ. Dọn dẹp sạch sẽ hàng ngày, báo cáo tiến độ.",
            },
            {
              num: "05",
              ico: "✅",
              name: "Bàn Giao & Bảo Hành",
              desc: "Nghiệm thu kỹ lưỡng. Bảo hành 24 tháng. Hỗ trợ bảo trì trọn đời.",
            },
          ].map((step) => (
            <div key={step.num} className="proc-step">
              <div className="proc-num">{step.num}</div>
              <div className="proc-ico">{step.ico}</div>
              <div className="proc-name">{step.name}</div>
              <div className="proc-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews">
        <div className="reviews-head">
          <div>
            <div className="sec-eyebrow">Khách Hàng Nói Gì</div>
            <h2 className="sec-title">Đánh Giá Thực Tế</h2>
          </div>
          <div className="rating-big">
            <div className="rating-num">4.9</div>
            <div className="r-stars">
              <div className="stars">★★★★★</div>
              <div className="rating-sub">Dựa trên 200+ đánh giá</div>
            </div>
          </div>
        </div>

        {/* Ô tìm kiếm đánh giá */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="🔍 Tìm đánh giá (tên, dự án, nội dung...)"
            value={reviewsSearch}
            onChange={(e) => { setReviewsSearch(e.target.value); setReviewsPage(1); }}
            className="cf-input"
            style={{ maxWidth: "350px", background: "var(--c2)", margin: 0 }}
          />
        </div>

        {searchedReviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
            Không tìm thấy đánh giá phù hợp.
          </div>
        ) : (
          <div 
            onMouseEnter={() => setIsReviewsHovered(true)} 
            onMouseLeave={() => setIsReviewsHovered(false)}
          >
            <div className="reviews-grid" style={{ display: "grid" }}>
              {currentReviews.map((item) => (
                <div key={item.id} className="review-card">
                  <div className="review-q">"</div>
                  <div className="review-stars">
                    {"★".repeat(Number(item.stars || 5))}
                  </div>
                  <p className="review-text">{item.text}</p>
                  <div className="review-author">
                    <div className="review-av" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.avatar ? (
                        <img src={item.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        item.name ? item.name.charAt(0).toUpperCase() : "T"
                      )}
                    </div>
                    <div>
                      <div className="review-name">{item.name}</div>
                      <div className="review-role">{item.role}</div>
                      <div className="review-proj">{item.project}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={reviewsPage}
              totalPages={totalReviewsPages}
              onPageChange={setReviewsPage}
            />
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section id="why">
        <div className="why-wrap">
          <div className="why-visual">
            <div className="why-card-main">
              <div className="why-grid-bg"></div>
              <div className="why-tag">Cam kết chất lượng</div>
              <div className="why-big">
                Tại Sao
                <br />
                Chọn
                <br />
                {content.brand_name || "ThạchPro"}?
              </div>
            </div>
            <div className="why-float">
              <div className="why-float-num">500+</div>
              <div className="why-float-lbl">
                Công Trình
                <br />
                Hoàn Thành
              </div>
            </div>
          </div>
          <div>
            <div className="sec-eyebrow">Điểm Khác Biệt</div>
            <h2 className="sec-title">
              Chúng Tôi Cam Kết
              <br />
              Điều Này
            </h2>
            <div className="why-list">
              {[
                {
                  title: "Khảo Sát & Tư Vấn Miễn Phí 100%",
                  desc: "Đội kỹ thuật đến tận nơi đo đạc, tư vấn giải pháp tối ưu. Không mất bất kỳ chi phí nào.",
                },
                {
                  title: "Báo Giá Trọn Gói Không Phát Sinh",
                  desc: "Hợp đồng rõ ràng từng hạng mục. Cam kết không phát sinh chi phí ngoài thỏa thuận ban đầu.",
                },
                {
                  title: "Đội Thợ Được Đào Tạo Bài Bản",
                  desc: "30+ thợ lành nghề chuyên về thạch cao, được đào tạo kỹ thuật theo tiêu chuẩn Knauf & USG.",
                },
                {
                  title: "Bảo Hành 24 Tháng Toàn Bộ Hạng Mục",
                  desc: "Bảo hành dài nhất trong ngành. Hỗ trợ bảo trì sau bảo hành với chi phí ưu đãi.",
                },
                {
                  title: "Vật Liệu Chính Hãng Có Chứng Nhận",
                  desc: "Chỉ sử dụng vật liệu có CO/CQ đầy đủ. Đại lý ủy quyền Knauf, USG, Vĩnh Tường.",
                },
              ].map((item, idx) => (
                <div key={idx} className="why-item">
                  <div className="why-check">✓</div>
                  <div>
                    <div className="why-item-title">{item.title}</div>
                    <div className="why-item-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="cta-inner">
          <div className="cta-text">
            <h2
              dangerouslySetInnerHTML={{
                __html:
                  content.cta_title || "Bắt Đầu Dự Án<br/>Của Bạn Hôm Ngày",
              }}
            ></h2>
            <p>
              {content.cta_desc ||
                "Liên hệ ngay để được tư vấn miễn phí và nhận báo giá trong 24 giờ. Đội ngũ ThạchPro luôn sẵn sàng biến ý tưởng của bạn thành hiện thực."}
            </p>
          </div>
          <div className="cta-actions">
            <a
              href={`tel:${content.contact_phone || "0901234567"}`}
              className="btn-cta-dark"
            >
              {content.cta_btn || "📞 Gọi Ngay: 0901 234 567"}
            </a>
            <div className="cta-phone-big">
              {content.contact_phone || "0901 234 567"}
            </div>
            <div className="cta-time">{content.contact_hours || "Thứ 2 – Chủ Nhật · 7:00 – 18:00"}</div>
          </div>
        </div>
      </section>

      {/* CONTACT & MAP */}
      <section id="contact">
        <div className="sec-eyebrow">Liên Hệ</div>
        <h2 className="sec-title">
          Đặt Lịch Khảo Sát
          <br />
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
            Miễn Phí
          </em>
        </h2>
        <p className="sec-desc" style={{ marginBottom: "4rem" }}>
          Điền form bên dưới — đội kỹ thuật sẽ liên hệ lại trong vòng{" "}
          <strong style={{ color: "var(--accent)" }}>30 phút</strong> để sắp xếp
          lịch khảo sát.
        </p>
        <div className="contact-wrap">
          <div>
            <div className="ci-item">
              <div className="ci-icon">📞</div>
              <div>
                <div className="ci-label">Hotline</div>
                <div className="ci-val">
                  {content.contact_phone || "0901 234 567"}
                </div>
                <div className="ci-sub">
                  {content.contact_hours || "Hotline 7:00–18:00"}
                </div>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-icon">💬</div>
              <div>
                <div className="ci-label">Zalo</div>
                <div className="ci-val">
                  {content.contact_zalo || "0901 234 567"}
                </div>
                <div className="ci-sub">
                  Nhắn tin nhận báo giá nhanh trong ngày
                </div>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-icon">📧</div>
              <div>
                <div className="ci-label">Email</div>
                <div className="ci-val">
                  {content.contact_email || "thachpro@gmail.com"}
                </div>
                <div className="ci-sub">Phản hồi trong 2 giờ làm việc</div>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-icon">📍</div>
              <div>
                <div className="ci-label">Showroom & Văn Phòng</div>
                <div className="ci-val">
                  {content.contact_address ||
                    "123 Nguyễn Văn Linh, Quận 7, TP.HCM"}
                </div>
                <div className="ci-sub">TP. Hồ Chí Minh · Gần cầu Kênh Tẻ</div>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-icon">🚚</div>
              <div>
                <div className="ci-label">Khu Vực Phục Vụ</div>
                <div className="ci-val">TP.HCM · Bình Dương · Long An</div>
                <div className="ci-sub">
                  Khảo sát và giao hàng tận nơi miễn phí
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-box">
            <div className="cf-title">Gửi Yêu Cầu Báo Giá</div>
            <form onSubmit={submitContact}>
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">Họ & Tên *</label>
                  <input
                    className="cf-input"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="cf-field">
                  <label className="cf-label">Số Điện Thoại *</label>
                  <input
                    className="cf-input"
                    type="tel"
                    placeholder="0901 234 567"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">Email</label>
                  <input
                    className="cf-input"
                    type="email"
                    placeholder="email@gmail.com"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="cf-field">
                  <label className="cf-label">Dịch Vụ Quan Tâm</label>
                  <select
                    className="cf-select"
                    value={contactForm.service}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        service: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    <option>Trần Thạch Cao Phẳng</option>
                    <option>Trần Giật Cấp</option>
                    <option>Vách Ngăn Thạch Cao</option>
                    <option>Phào Chỉ Trang Trí</option>
                    <option>Bả Bột & Sơn Nước</option>
                    <option>Mua Vật Liệu Sỉ/Lẻ</option>
                    <option>Tư Vấn Trọn Gói</option>
                  </select>
                </div>
              </div>
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">Diện Tích (m²)</label>
                  <input
                    className="cf-input"
                    type="text"
                    placeholder="VD: 50 m²"
                    value={contactForm.area}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, area: e.target.value })
                    }
                  />
                </div>
                <div className="cf-field">
                  <label className="cf-label">Địa Điểm Công Trình</label>
                  <input
                    className="cf-input"
                    type="text"
                    placeholder="Quận / Huyện, TP.HCM"
                    value={contactForm.address}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="cf-field">
                <label className="cf-label">Ghi Chú / Yêu Cầu Thêm</label>
                <textarea
                  className="cf-textarea"
                  placeholder="Mô tả thêm yêu cầu..."
                  value={contactForm.note}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, note: e.target.value })
                  }
                ></textarea>
              </div>
              <button
                className="cf-submit"
                type="submit"
                disabled={contactLoading}
              >
                {contactLoading ? "⏳ Đang gửi..." : "📩 Gửi Yêu Cầu Báo Giá"}
              </button>
              {contactSuccess && (
                <div className="cf-success show">
                  ✅ Gửi thành công! Chúng tôi sẽ liên hệ lại trong vòng 30
                  phút. Cảm ơn bạn!
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* GOOGLE MAPS WITH CLICK-TO-MAP REDIRECT */}
      <section id="map-section">
        <div className="map-wrap">
          <div
            className="map-container-clickable"
            onClick={() =>
              window.open(
                content.contact_map_url || "https://maps.google.com/?q=10.732498,106.717207",
                "_blank"
              )
            }
            title="Nhấp vào để mở Google Maps chỉ đường"
          >
            <div className="map-overlay-trigger">
              <span>🗺️ Click để mở bản đồ định vị trên Google Maps</span>
            </div>
            <iframe
              className="map-frame"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0282977647386!2d106.71720767587655!3d10.732498089396068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9ab4c3a6bf%3A0x4a8a7e5db1d31e1!2zTmd1eeG7hW4gVsSDbiBMaW5oLCBRdeG6rW4gNywgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2svn!4v1700000000000"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí ThạchPro"
              style={{ pointerEvents: "none" }}
            ></iframe>
          </div>
          <div className="map-card">
            <div className="map-card-title">
              📍 <span>{content.brand_name || "ThạchPro"}</span> Showroom
            </div>
            <div className="map-info-row">
              <span className="map-ico">🏠</span>
              <span>
                {content.contact_address ||
                  "123 Nguyễn Văn Linh, Quận 7, TP.HCM"}
              </span>
            </div>
            <div className="map-info-row">
              <span className="map-ico">📞</span>
              <span>{content.contact_phone || "0901 234 567"}</span>
            </div>
            <div className="map-info-row">
              <span className="map-ico">🕐</span>
              <span>7:00 – 18:00 · Thứ 2 – Chủ Nhật</span>
            </div>
            <div className="map-info-row">
              <span className="map-ico">🚗</span>
              <span>Có bãi đậu xe miễn phí</span>
            </div>
            <a
              href={content.contact_map_url || "https://maps.google.com/?q=10.732498,106.717207"}
              target="_blank"
              rel="noreferrer"
              className="map-cta-btn"
            >
              🗺️ Xem Trên Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* FLOATING CONTACT WIDGETS */}
      <div id="zalo-float">
        <div className="zf-row">
          <span className="zf-label">Gọi ngay</span>
          <a
            href={`tel:${content.contact_phone || "0901234567"}`}
            className="phone-btn"
            title="Gọi điện ngay"
          >
            📞
          </a>
        </div>
        <div className="zf-row">
          <a
            href={
              content.contact_zalo
                ? `https://zalo.me/${content.contact_zalo.replace(/\s+/g, "")}`
                : "https://zalo.me/0901234567"
            }
            target="_blank"
            rel="noreferrer"
            className="zalo-btn"
            title="Chat Zalo"
          >
            <span
              style={{
                background: "white",
                color: "#0068FF",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: ".75rem",
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              Z
            </span>
            Chat Zalo
          </a>
        </div>
      </div>

      {/* MODAL GIAO DIỆN TUYỂN DỤNG THỢ CỰC KỲ CHUYÊN NGHIỆP */}
      {showRecruitModal && (
        <div className="modal-bg open" style={{ zIndex: 1000 }}>
          <div className="modal" style={{ maxWidth: "480px" }}>
            <button className="modal-close" onClick={() => setShowRecruitModal(false)}>✕</button>
            <div className="modal-title">💼 Đăng Ký Ứng Tuyển Thợ</div>
            
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "1.5rem", lineHeight: "1.6" }}>
              {content.brand_name || "ThạchPro"} liên tục tuyển thợ chính thạch cao, thợ phụ thạch cao, tổ đội thầu phụ làm việc tại TP.HCM & Bình Dương. 
              <br />
              <strong style={{ color: "var(--accent)", display: "block", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                📞 Hotline liên hệ trực tiếp Chủ: {content.contact_phone || "0901 234 567"}
              </strong>
            </p>

            <form onSubmit={submitRecruitment}>
              <div className="mf-field">
                <label className="mf-label">Họ & Tên của bạn *</label>
                <input
                  className="mf-input"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={recruitForm.name}
                  onChange={(e) => setRecruitForm({ ...recruitForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="mf-field">
                <label className="mf-label">Số Điện Thoại liên hệ *</label>
                <input
                  className="mf-input"
                  type="tel"
                  placeholder="0901 234 567"
                  value={recruitForm.phone}
                  onChange={(e) => setRecruitForm({ ...recruitForm, phone: e.target.value })}
                  required
                />
              </div>
              <div className="mf-field">
                <label className="mf-label">Vị trí muốn ứng tuyển *</label>
                <select
                  className="mf-select"
                  value={recruitForm.position}
                  onChange={(e) => setRecruitForm({ ...recruitForm, position: e.target.value })}
                  required
                >
                  <option value="">-- Chọn vị trí thợ --</option>
                  <option value="Thợ Chính">Thợ Chính (Đóng khung trần/vách)</option>
                  <option value="Thợ Phụ">Thợ Phụ (Bê tấm, phụ việc bắn vít)</option>
                  <option value="Thợ Sơn Nước">Thợ Sơn Nước / Bả Bột Matit</option>
                  <option value="Tổ Đội Thầu">Tổ Đội Thầu Phụ (Cả nhóm thợ)</option>
                </select>
              </div>
              <div className="mf-field">
                <label className="mf-label">Số năm kinh nghiệm & Ghi chú thêm</label>
                <textarea
                  className="mf-textarea"
                  placeholder="Mô tả ngắn kinh nghiệm làm thạch cao của bạn..."
                  value={recruitForm.experience}
                  onChange={(e) => setRecruitForm({ ...recruitForm, experience: e.target.value })}
                  style={{ minHeight: "80px" }}
                />
              </div>
              <button type="submit" className="cf-submit" style={{ marginTop: "1rem" }}>
                📩 Nộp Hồ Sơ Ứng Tuyển
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo-wrap">
              {content.logo_image ? (
                <img src={content.logo_image} alt="Logo" style={{ height: "45px", objectFit: "contain" }} />
              ) : (
                <>
                  <div className="logo-icon">🏠</div>
                  <span className="logo-text">
                    {content.brand_name || "ThạchPro"}
                  </span>
                </>
              )}
            </a>
            <p>
              {content.footer_desc ||
                "Đơn vị thi công thạch cao và cung cấp vật liệu xây dựng chuyên nghiệp tại TP.HCM từ năm 2008."}
            </p>
            <div className="social-row">
              <a href="#" className="social-btn">
                f
              </a>
              <a href="#" className="social-btn">
                Z
              </a>
              <a href="#" className="social-btn">
                ▶
              </a>
              <a href="#" className="social-btn">
                ♪
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Dịch Vụ</h4>
            <ul>
              <li>
                <a href="#services">→ Trần Thạch Cao Phẳng</a>
              </li>
              <li>
                <a href="#services">→ Trần Giật Cấp</a>
              </li>
              <li>
                <a href="#services">→ Vách Ngăn Nhẹ</a>
              </li>
              <li>
                <a href="#services">→ Phào Chỉ Trang Trí</a>
              </li>
              <li>
                <a href="#services">→ Bả Bột & Sơn Nước</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Vật Liệu</h4>
            <ul>
              <li>
                <a href="#materials">→ Tấm Thạch Cao Knauf</a>
              </li>
              <li>
                <a href="#materials">→ Tấm Thạch Cao USG</a>
              </li>
              <li>
                <a href="#materials">→ Khung Thép Mạ Kẽm</a>
              </li>
              <li>
                <a href="#materials">→ Bông Khoáng</a>
              </li>
              <li>
                <a href="#materials">→ Bột Bả & Sơn Nước</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Liên Hệ</h4>
            <div className="fci">
              <span className="fci-ico">📞</span>
              <div>
                <strong>{content.contact_phone || "0901 234 567"}</strong>
                <br />
                <small>{content.contact_hours || "Thứ 2 – Chủ Nhật · 7:00 – 18:00"}</small>
              </div>
            </div>
            <div className="fci">
              <span className="fci-ico">💬</span>
              <div>Zalo: {content.contact_zalo || "0901 234 567"}</div>
            </div>
            <div className="fci">
              <span className="fci-ico">📧</span>
              <div>{content.contact_email || "thachpro@gmail.com"}</div>
            </div>
            <div className="fci">
              <span className="fci-ico">📍</span>
              <div>
                {content.contact_address ||
                  "123 Nguyễn Văn Linh, Quận 7, TP.HCM"}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM VỚI HUY HIỆU LA BÀN ĐỊNH VỊ CHỦ QUYỀN BIỂN ĐẢO */}
        <div className="footer-bottom">
          <p>
            © 2024 <span>{content.brand_name || "ThạchPro"}</span>. Tất cả quyền
            được bảo lưu.
          </p>

          <div
            className="vn-sovereignty-badge"
            title="Hoàng Sa & Trường Sa là của Việt Nam!"
          >
            <div className="vn-compass-wrap">
              <svg
                className="vn-compass-vector"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#E8A020"
                  strokeWidth="1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="rgba(232, 160, 32, 0.2)"
                  strokeWidth="0.5"
                  strokeDasharray="3, 3"
                />
                <polygon points="50,10 54,50 50,54" fill="#F5C842" />
                <polygon points="50,10 46,50 50,54" fill="#E8A020" />
                <polygon points="50,90 46,50 50,46" fill="#F5C842" />
                <polygon points="50,90 54,50 50,46" fill="#E8A020" />
                <polygon points="90,50 50,46 46,50" fill="#F5C842" />
                <polygon points="90,50 50,54 46,50" fill="#E8A020" />
                <polygon points="10,50 50,54 54,50" fill="#F5C842" />
                <polygon points="10,50 50,46 54,50" fill="#E8A020" />
                <circle
                  cx="50"
                  cy="50"
                  r="6"
                  fill="#1C1F28"
                  stroke="#E8A020"
                  strokeWidth="1.5"
                />
                <circle cx="50" cy="50" r="2" fill="#F5C842" />
              </svg>
            </div>

            <div className="vn-coordinates-block">
              <div className="coord-item">
                <span className="coord-title">📍 Quần đảo Hoàng Sa</span>
                <span className="coord-val">16°30′B 112°00′Đ</span>
              </div>
              <div className="coord-item">
                <span className="coord-title">📍 Quần đảo Trường Sa</span>
                <span className="coord-val">10°24′B 114°21′Đ</span>
              </div>
            </div>

            <div className="vn-sovereignty-divider"></div>

            <div className="vn-sovereignty-text">
              <span className="slogan-main">HOÀNG SA - TRƯỜNG SA</span>
              <span className="slogan-sub">LÀ CỦA VIỆT NAM 🇻🇳</span>
            </div>
          </div>

          <div className="cert-row">
            <div className="cert-badge">Knauf Partner</div>
            <div className="cert-badge">USG Authorized</div>
            <div className="cert-badge">ISO 9001</div>
          </div>
        </div>
      </footer>
    </>
  );
}