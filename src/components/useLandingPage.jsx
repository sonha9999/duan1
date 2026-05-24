// src/components/useLandingPage.js
import { useState, useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient";

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

const GALLERY_LIMIT = 6;
const REVIEWS_LIMIT = 3;

export function useLandingPage() {
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

  const [galleryPage, setGalleryPage] = useState(1);
  const [materialsPage, setMaterialsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);

  const [gallerySearch, setGallerySearch] = useState("");
  const [materialsSearch, setMaterialsSearch] = useState("");
  const [reviewsSearch, setReviewsSearch] = useState("");

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [isMaterialsHovered, setIsMaterialsHovered] = useState(false);
  const [isReviewsHovered, setIsReviewsHovered] = useState(false);

  const [materialsLimit, setMaterialsLimit] = useState(8);

  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [recruitForm, setRecruitForm] = useState({
    name: "",
    phone: "",
    position: "",
    experience: "",
  });

  const [activePolicy, setActivePolicy] = useState(null);

  const [configRoom, setConfigRoom] = useState("🛋️ Phòng Khách");
  const [configPhotoIdx, setConfigPhotoIdx] = useState(0);
  const [simulatorItems, setSimulatorItems] = useState([]);
  const [selectedSimulatorUrl, setSelectedSimulatorUrl] = useState("");

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

  useEffect(() => {
    const updateMaterialsLimit = () => {
      if (window.innerWidth <= 768) {
        setMaterialsLimit(4);
      } else {
        setMaterialsLimit(8);
      }
    };
    updateMaterialsLimit();
    window.addEventListener("resize", updateMaterialsLimit);
    return () => window.removeEventListener("resize", updateMaterialsLimit);
  }, []);

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
    async function loadDataFromSupabase() {
      setLoadingGallery(true);
      try {
        const { data: galleryData, error: galleryErr } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (!galleryErr && galleryData) {
          setGalleryItems(galleryData);
          setFilteredItems(galleryData);
        }

        const { data: reviewsData, error: reviewsErr } = await supabase
          .from("reviews")
          .select("*");

        const dbReviews = reviewsData || [];
        const combinedReviews = DEFAULT_REVIEWS.map((def) => {
          const edited = dbReviews.find((db) => db.id === def.id);
          return edited ? edited : def;
        });
        const newlyAddedReviews = dbReviews.filter(
          (db) => !DEFAULT_REVIEWS.some((def) => def.id === db.id)
        );
        setReviews([...combinedReviews, ...newlyAddedReviews]);

        const { data: materialsData, error: materialsErr } = await supabase
          .from("materials")
          .select("*");

        const dbMaterials = materialsData || [];
        const combinedMaterials = DEFAULT_MATERIALS.map((def) => {
          const edited = dbMaterials.find((db) => db.id === def.id);
          return edited ? edited : def;
        });
        const newlyAddedMaterials = dbMaterials.filter(
          (db) => !DEFAULT_MATERIALS.some((def) => def.id === db.id)
        );
        setMaterials([...combinedMaterials, ...newlyAddedMaterials]);

        const { data: contentData } = await supabase.from("content").select("*");

        if (contentData && contentData.length > 0) {
          const obj = {};
          contentData.forEach((item) => (obj[item.key] = item.value));
          setContent(obj);
        }

        const { data: simulatorData } = await supabase.from("simulator").select("*");
        if (simulatorData) {
          setSimulatorItems(simulatorData);
        }
      } catch (err) {
        console.error("Lỗi kết nối database:", err);
        setMaterials(DEFAULT_MATERIALS);
      } finally {
        setLoadingGallery(false);
      }
    }

    loadDataFromSupabase();
  }, []);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    setGalleryPage(1);
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

  const submitContact = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      alert("Vui lòng nhập Họ tên và Số điện thoại!");
      return;
    }
    setContactLoading(true);
    try {
      const finalNote = contactForm.note + (selectedSimulatorUrl ? " " + selectedSimulatorUrl : "");
      const { error } = await supabase.from("contacts").insert([
        {
          name: contactForm.name,
          phone: contactForm.phone,
          email: contactForm.email,
          service: contactForm.service,
          area: contactForm.area,
          address: contactForm.address,
          note: finalNote,
        },
      ]);
      if (error) throw error;
      setContactSuccess(true);
      setContactForm({ name: "", phone: "", email: "", service: "", area: "", address: "", note: "" });
      setSelectedSimulatorUrl("");
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setContactLoading(false);
    }
  };

  const submitRecruitment = async (e) => {
    e.preventDefault();
    if (!recruitForm.name || !recruitForm.phone || !recruitForm.position) {
      alert("Vui lòng nhập đầy đủ thông tin ứng tuyển!");
      return;
    }
    try {
      const { error } = await supabase.from("recruitment").insert([
        {
          name: recruitForm.name,
          phone: recruitForm.phone,
          position: recruitForm.position,
          experience: recruitForm.experience,
        },
      ]);
      if (error) throw error;
      alert("Nộp hồ sơ ứng tuyển thành công!");
      setShowRecruitModal(false);
      setRecruitForm({ name: "", phone: "", position: "", experience: "" });
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const renderLogoText = (text) => {
    const defaultLogo = <>Thạch<span>Pro</span></>;
    if (!text) return defaultLogo;
    const trimmed = text.trim();
    const capIndices = [];
    for (let i = 1; i < trimmed.length; i++) {
      if (trimmed[i] === trimmed[i].toUpperCase() && trimmed[i] !== " " && isNaN(trimmed[i])) {
        capIndices.push(i);
      }
    }
    if (capIndices.length > 0 && !trimmed.includes(" ")) {
      const splitIdx = capIndices[0];
      return <>{trimmed.slice(0, splitIdx)}<span>{trimmed.slice(splitIdx)}</span></>;
    }
    const words = trimmed.split(" ");
    if (words.length > 1) {
      return <>{words.slice(0, words.length - 1).join(" ")} <span>{words[words.length - 1]}</span></>;
    }
    return <>{trimmed}</>;
  };

  const searchedGallery = filteredItems.filter((item) => {
    const titleStr = item.title ? item.title.toLowerCase() : "";
    const locStr = item.location && item.location.toLowerCase();
    return titleStr.includes(gallerySearch.toLowerCase()) || (locStr && locStr.includes(gallerySearch.toLowerCase()));
  });
  const totalGalleryPages = Math.ceil(searchedGallery.length / GALLERY_LIMIT);
  const currentGalleryItems = searchedGallery.slice((galleryPage - 1) * GALLERY_LIMIT, galleryPage * GALLERY_LIMIT);

  const searchedMaterials = materials.filter((mat) => {
    const nameStr = mat.name ? mat.name.toLowerCase() : "";
    const brandStr = mat.brand ? mat.brand.toLowerCase() : "";
    const tagStr = mat.tags ? mat.tags.toLowerCase() : "";
    return nameStr.includes(materialsSearch.toLowerCase()) || brandStr.includes(materialsSearch.toLowerCase()) || tagStr.includes(materialsSearch.toLowerCase());
  });
  const totalMaterialsPages = Math.ceil(searchedMaterials.length / materialsLimit);
  const currentMaterials = searchedMaterials.slice((materialsPage - 1) * materialsLimit, materialsPage * materialsLimit);

  const searchedReviews = reviews.filter((rev) => {
    const nameStr = rev.name ? rev.name.toLowerCase() : "";
    const textStr = rev.text ? rev.text.toLowerCase() : "";
    const projStr = rev.project ? rev.project.toLowerCase() : "";
    return nameStr.includes(reviewsSearch.toLowerCase()) || textStr.includes(reviewsSearch.toLowerCase()) || projStr.includes(reviewsSearch.toLowerCase());
  });
  const totalReviewsPages = Math.ceil(searchedReviews.length / REVIEWS_LIMIT);
  const currentReviews = searchedReviews.slice((reviewsPage - 1) * REVIEWS_LIMIT, reviewsPage * REVIEWS_LIMIT);

  const activePhotosList = getActiveSimulatorPhotos();
  const activePhotoUrl = activePhotosList[configPhotoIdx % activePhotosList.length] || activePhotosList[0];

  const handlePrevConfigPhoto = () => {
    setConfigPhotoIdx((prev) => (prev === 0 ? activePhotosList.length - 1 : prev - 1));
  };

  const handleNextConfigPhoto = () => {
    setConfigPhotoIdx((prev) => (prev >= activePhotosList.length - 1 ? 0 : prev + 1));
  };

  const handleConfiguratorSubmit = () => {
    const text = "Tôi muốn đăng ký nhận tư vấn và khảo sát thi công trần thạch cao thực tế theo Mẫu 3D: [" + configRoom + " - Ảnh số " + (configPhotoIdx + 1) + "].";
    setContactForm({ ...contactForm, note: text, service: "Tư Vấn Trọn Gói" });
    setSelectedSimulatorUrl(activePhotoUrl);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (totalGalleryPages <= 1 || isGalleryHovered) return;
    const interval = setInterval(() => {
      setGalleryPage((prev) => (prev >= totalGalleryPages ? 1 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [totalGalleryPages, isGalleryHovered]);

  useEffect(() => {
    if (totalMaterialsPages <= 1 || isMaterialsHovered) return;
    const interval = setInterval(() => {
      setMaterialsPage((prev) => (prev >= totalMaterialsPages ? 1 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [totalMaterialsPages, isMaterialsHovered]);

  useEffect(() => {
    if (totalReviewsPages <= 1 || isReviewsHovered) return;
    const interval = setInterval(() => {
      setReviewsPage((prev) => (prev >= totalReviewsPages ? 1 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [totalReviewsPages, isReviewsHovered]);

  return {
    galleryItems, filteredItems, reviews, materials, content, activeCategory, loadingGallery,
    mobileMenuOpen, setMobileMenuOpen, activeGalleryProject, setActiveGalleryProject,
    currentPhotoIdx, setCurrentPhotoIdx, galleryPage, setGalleryPage, materialsPage, setMaterialsPage,
    reviewsPage, setReviewsPage, gallerySearch, setGallerySearch, materialsSearch, setMaterialsSearch,
    reviewsSearch, setReviewsSearch, isScrolled, activeSection, isGalleryHovered, setIsGalleryHovered,
    isMaterialsHovered, setIsMaterialsHovered, isReviewsHovered, setIsReviewsHovered,
    showRecruitModal, setShowRecruitModal, recruitForm, setRecruitForm, configRoom, setConfigRoom,
    configPhotoIdx, activePhotosList, activePhotoUrl, handlePrevConfigPhoto, handleNextConfigPhoto,
    handleConfiguratorSubmit, calcParams, calcResult, handleCalc, contactForm, setContactForm,
    contactLoading, contactSuccess, renderLogoText, submitContact, submitRecruitment,
    totalGalleryPages, currentGalleryItems, totalMaterialsPages, currentMaterials,
    totalReviewsPages, currentReviews, activePolicy, setActivePolicy
  };
}