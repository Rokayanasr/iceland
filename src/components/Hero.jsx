import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../App.css";
import { Navbar, NavbarCollapse, NavbarToggle } from "flowbite-react";
import heroImg from "../assets/hero-img.svg";
import featureImg from "../assets/feature-img.svg";
import formImg from "../assets/formImg.svg";
import { Field, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

function Hero() {
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(2, "الاسم الأول يجب أن يحتوي على حرفين على الأقل").max(50, "الاسم الأول يجب ألا يتجاوز 50 حرف").required("الاسم الأول مطلوب"),
        lastName: Yup.string().min(2, "الاسم الأخير يجب أن يحتوي على حرفين على الأقل").max(50, "الاسم الأخير يجب ألا يتجاوز 50 حرف").required("الاسم الأخير مطلوب"),
        serviceName: Yup.string().min(2, "اسم الخدمة يجب أن يحتوي على حرفين على الأقل").max(100, "اسم الخدمة يجب ألا يتجاوز 100 حرف").required("اسم الخدمة مطلوب"),
        phone: Yup.string()
            .matches(/^[0-9]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط")
            .min(8, "رقم الهاتف يجب أن يحتوي على 8 أرقام على الأقل")
            .max(15, "رقم الهاتف يجب ألا يتجاوز 15 رقم")
            .required("رقم الهاتف مطلوب"),
        email: Yup.string().email("البريد الإلكتروني غير صحيح").required("البريد الإلكتروني مطلوب"),
        image: Yup.mixed()
            .required("الصورة مطلوبة")
            .test("fileSize", "حجم الصورة يجب ألا يتجاوز 5 ميجابايت", (value) => {
                return value && value.size <= 5 * 1024 * 1024;
            }),
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            serviceName: "",
            phone: "",
            email: "",
            image: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                console.log(values);
                if (key === "image" && values[key]) {
                    formData.append(key, values[key]);
                } else if (key !== "image") {
                    formData.append(key, values[key]);
                }
            });

            const loadingToast = toast.loading("Sending email...");

            try {
                const response = await axios.post("https://iceland-server-ecru.vercel.app/send-email", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                formik.resetForm();
                toast.update(loadingToast, {
                    render: "تم ارسال البيانات بنجاح",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000,
                });
                console.log(response);
            } catch (error) {
                console.log(error);
                toast.update(loadingToast, {
                    render: "خطأ في ارسال البيانات",
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                });
            }
        },
    });

    const services = [
        "الدراسة - مكالمة صوتية",
        "الدراسة - استشارة كتابية",
        "العمل - مكالمة صوتية",
        "العمل - استشارة كتابية",
        "السياحة - مكالمة صوتية",
        "السياحة - استشارة كتابية",
        "الاقامة - مكالمة صوتية",
        "الاقامة - استشارة كتابية",
    ];
    const voiceCalls = [
        { category: "study", name: "الدراسة", price: 19.99, originalPrice: 25, duration: "30 دقيقة" },
        { category: "work", name: "العمل", price: 24.99, originalPrice: 30, duration: "30 دقيقة" },
        { category: "residence", name: "الاقامة", price: 39.99, originalPrice: 50, duration: "30 دقيقة" },
        { category: "tourism", name: "السياحة", price: 44.99, originalPrice: 60, duration: "30 دقيقة" },
    ];

    const writtenConsultations = [
        { category: "study", name: "الدراسة", price: 14.99, originalPrice: 20 },
        { category: "work", name: "العمل", price: 19.99, originalPrice: 25 },
        { category: "residence", name: "الاقامة", price: 34.99, originalPrice: 40 },
        { category: "tourism", name: "السياحة", price: 39.99, originalPrice: 50 },
    ];

    // Handle navbar scroll
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [navHidden, setNavHidden] = useState(false);
    const [selectedBtnStyle, setSelectedBtnStyle] = useState("all");

    const filteredVoiceCalls = selectedBtnStyle == "all" ? voiceCalls : voiceCalls.filter((call) => call.category === selectedBtnStyle);
    const filteredConsultations = selectedBtnStyle == "all" ? writtenConsultations : writtenConsultations.filter((consultation) => consultation.category === selectedBtnStyle);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScrollTop) {
                setNavHidden(true);
            } else {
                setNavHidden(false);
            }
            setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollTop]);
    useEffect(() => {
        AOS.init();
    }, []);
    const handleFilter = (button) => {
        setSelectedBtnStyle(button);
    };

    return (
        <>
            <Navbar fluid rounded className={`md:py-6 md:flex block py-2 md:px-20 px-4 fixed z-20 bg-whity shadow-2xl w-full ${navHidden ? "hidden" : ""}`}>
                <div className='flex items-center md:order-2 md:space-x-0 rtl:space-x-reverse'>
                    <NavbarToggle className='text-primary hover:bg-transparent focus:bg-transparent' />
                </div>
                <NavbarCollapse className='uppercase w-full justify-center'>
                    <ul className='md:flex md:flex-row flex-col gap-6 items-center justify-center'>
                        <a href='#main' className='nav-btn bg-primary text-whity'>
                            الرئيسية
                        </a>
                        <a href='#feature' className='nav-btn text-primary'>
                            مميزات الخدمة
                        </a>
                        <a href='#contactus' className='nav-btn text-primary'>
                            تواصل معنا
                        </a>
                        <a href='#service' className='nav-btn text-primary'>
                            الخدمات
                        </a>
                    </ul>
                </NavbarCollapse>
            </Navbar>
            {/* Hero */}
            <section id='main' className='hero-bg flex md:pt-16 pb-8 pt-10 md:px-20 px-4 items-end justify-center rounded-2xl'>
                <div className='w-full h-full flex justify-end flex-col gap-8'>
                    <img src={heroImg} alt='hero-img' className=' hero-img' />
                    <h1 className='text-primary monadi font-normal tracking-tight text-center flex items-center justify-center'>مرحبًا بكم في عالمنا اللطِيف!</h1>
                </div>
            </section>
            <section data-aos='fade-left' className='flex flex-col md:pb-16 pb-10 md:px-20 px-4 items-center justify-center gap-8'>
                <h2 className='text-secondaryDark reqaa text-center font-extralight'>نحن مرام وصلاح</h2>
                <h5 className='text-primary text-justify'>
                    زوجان يقيمان في {""}
                    <span className='font-bold text-secondaryDark'>ايسلندا</span>، نقدم لكم استشارات متخصصة لجعل تجربتكم في هذا البلد الفريد لا تُنسى، نساعدكم في استكشاف الثقافة
                    المحلية، اكتشاف أفضل الوجهات السياحية، وتخطيط حياتكم اليومية في أيسلندا بكل سهولة ونجاح، دعونا نكون مرشديكم في هذه الرحلة، وتواصلوا معنا للحصول على استشارة
                    شخصية، لنضمن لكم تجربة استثنائية في قلب الطبيعة الخلابة.
                </h5>
            </section>

            {/* Services */}
            <section id='service' className='my-container bg-secondary'>
                <div className='flex flex-col w-full  items-center gap-8'>
                    <div className='flex flex-col gap-6'>
                        <h1 data-aos='fade-left' className='monadi text-center'>
                            بخبــرة سنــوات
                        </h1>
                        {/* <h2 className='reqaa text-center'> نحن هنا لنخطط معًا رحلتك المثالية إلى آيسلندا</h2> */}
                        <h5 data-aos='fade-right' className='text-center text-primary'>
                            نحن هنا لنخطط معًا رحلتك المثالية إلى آيسلندا، خدماتنا تشمل كل ما تحتاجه لجعل تجربتك لا تُنسى : - الإجابة على جميع الأسئلة المتعلقة بالسفر إلى آيسلندا:
                            السياحة، العمل، الدراسة، الإقامة. - مساعدتك في اتخاذ القرار المناسب لزيارة آيسلندا.
                        </h5>
                        <h5 data-aos='fade-left' className='text-center underline font-bold'>
                            أسعار الاستشارات:
                        </h5>
                    </div>

                    {/* FILTER */}
                    <div data-aos='zoom-in' className='flex outline outline-2 outline-whity rounded-full md:filter w-full h-20 p-1 shadow-xl gap-1'>
                        <button
                            onClick={() => handleFilter("study")}
                            className={`filter-btn rounded-full text-whity text-lg md:text-xl border-whity border w-1/4 ${selectedBtnStyle == "study" ? "bg-secondaryDark" : ""}`}
                        >
                            الدراسة
                        </button>
                        <button
                            onClick={() => handleFilter("work")}
                            className={`filter-btn rounded-full text-whity text-lg md:text-xl border-whity border  w-1/4 ${selectedBtnStyle == "work" ? "bg-secondaryDark" : ""}`}
                        >
                            العمل
                        </button>
                        <button
                            onClick={() => handleFilter("all")}
                            className={`filter-btn rounded-full text-whity text-lg md:text-xl border-whity border w-1/5 ${selectedBtnStyle === "all" ? "bg-secondaryDark" : ""}`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => handleFilter("residence")}
                            className={`filter-btn rounded-full text-whity text-lg md:text-xl border-whity border  w-1/4 ${
                                selectedBtnStyle == "residence" ? "bg-secondaryDark" : ""
                            }`}
                        >
                            الإقامة
                        </button>
                        <button
                            onClick={() => handleFilter("tourism")}
                            className={`filter-btn rounded-full text-whity text-lg md:text-xl border-whity border  w-1/4 ${
                                selectedBtnStyle == "tourism" ? "bg-secondaryDark" : ""
                            }`}
                        >
                            السياحة
                        </button>
                    </div>
                    {/* CARDS */}
                    <div
                        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-8
                    '
                    >
                        {filteredVoiceCalls.map((call, index) => (
                            <div
                                data-aos='flip-right'
                                key={index}
                                className='card outline gap-4 bg-whity border-r-4  border-b-4 shadow-lg border-secondaryDark outline-secondaryDark rounded-2xl flex flex-col justify-center items-center p-4 w-full sm:w-[16rem]'
                            >
                                <h3 className='text-primary'>{call.name}</h3>
                                <div className='flex items-end justify-center gaw-28 h-12'>
                                    <div className='flex flex-col'>
                                        <h5 className='text-secondaryDark'>
                                            بدلاَ من
                                            <span className='price'> {call.originalPrice}$</span>
                                        </h5>
                                        <h2 className='call-price font-black text-primary'>{call.price}$ /</h2>
                                    </div>
                                    <h5 className='text-lg font-semibold text-center text-primary'>
                                        مكالمة
                                        <br />
                                        صوتيــة
                                    </h5>
                                </div>
                                <h5 className='call-duration text-secondaryDark'>المدة: {call.duration}</h5>
                                <a href='#form' className='flex gap-2'>
                                    <button className='underline text-primary text-lg justify-center items-center'>احجز استشارتك الان</button>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                                        <path
                                            d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z'
                                            stroke='#5E604B'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                        />
                                        <path d='M12 16L8 12L12 8' stroke='#5E604B' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                        <path d='M16 12H8' stroke='#5E604B' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                    </svg>
                                </a>
                            </div>
                        ))}
                        {filteredConsultations.map((consultancy, index) => (
                            <div
                                data-aos='flip-left'
                                key={index}
                                className='card w-full sm:w-[16rem] outline gap-4 bg-whity border-r-4  border-b-4 shadow-lg border-secondaryDark outline-secondaryDark rounded-2xl flex flex-col justify-center items-center p-4'
                            >
                                <h3 className='text-primary'>{consultancy.name}</h3>
                                <div className='flex items-end justify-center gap-2 h-12'>
                                    <div className='flex flex-col'>
                                        <h5 className='text-secondaryDark'>
                                            بدلاَ من
                                            <span className='price'> {consultancy.originalPrice}$</span>
                                        </h5>
                                        <h2 className='consultancy-price font-black text-primary'>{consultancy.price}$ /</h2>
                                    </div>
                                    <h5 className='text-lg font-semibold text-center text-primary'>
                                        استشارة
                                        <br />
                                        كتابيــــة
                                    </h5>
                                </div>
                                <a href='#form' className='flex gap-2'>
                                    <button className='underline text-primary text-lg justify-center items-center'>احجز استشارتك الان</button>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                                        <path
                                            d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z'
                                            stroke='#5E604B'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                        />
                                        <path d='M12 16L8 12L12 8' stroke='#5E604B' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                        <path d='M16 12H8' stroke='#5E604B' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                    </svg>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id='feature' className='feature-line my-container bg-whity text-primary'>
                <h1 className=' monadi text-primary lg:hidden flex items-center pb-8 justify-center w-full text-center'>مميزات خدمتنا</h1>

                <div className='flex lg:flex-row flex-col justify-around items-center gap-10'>
                    <div className=' basis-1/2'>
                        <div data-aos='fade-left' className='flex flex-col items-start justify-start gap-6'>
                            <h1 className=' monadi text-primary hidden lg:flex items-center justify-center w-full text-center'>مميزات خدمتنا</h1>

                            <div className='flex flex-col gap-4'>
                                <div className='flex items-start gap-2'>
                                    <svg className='fill-primary w-14' xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 64 64' data-name='Layer 1'>
                                        <path d='m4 35c18.621 4.21 20 23 20 23s1.379-18.79 20-23c-18.621-4.21-20-23-20-23s-1.379 18.79-20 23z' />
                                        <path d='m38 48c10.241 2.2 11 12 11 12s.759-9.8 11-12c-10.241-2.2-11-12-11-12s-.759 9.8-11 12z' />
                                        <path d='m31 16c10.241 2.2 11 12 11 12s.759-9.8 11-12c-10.241-2.2-11-12-11-12s-.759 9.8-11 12z' />
                                    </svg>
                                    <h5 className='text-primary lg:text-xl text-justify'>
                                        <span className='font-bold text-secondaryDark '>تلبية استفساراتك مسبقاً:</span> نأخذ جميع استفساراتك المتعلقة بكل باقة قبل الجلسة لضمان
                                        تلبية احتياجاتك بالكامل. {""}
                                    </h5>
                                </div>
                                <div className='flex items-start gap-2'>
                                    <svg className='fill-primary w-14' xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 64 64' data-name='Layer 1'>
                                        <path d='m4 35c18.621 4.21 20 23 20 23s1.379-18.79 20-23c-18.621-4.21-20-23-20-23s-1.379 18.79-20 23z' />
                                        <path d='m38 48c10.241 2.2 11 12 11 12s.759-9.8 11-12c-10.241-2.2-11-12-11-12s-.759 9.8-11 12z' />
                                        <path d='m31 16c10.241 2.2 11 12 11 12s.759-9.8 11-12c-10.241-2.2-11-12-11-12s-.759 9.8-11 12z' />
                                    </svg>
                                    <h5 className='text-primary lg:text-xl text-justify'>
                                        <span className='font-bold text-secondaryDark '>ملخص مكتوب:</span> نقدم لك ملخصاً مكتوباً يتضمن جميع المعلومات والنقاط التي تم تناولها خلال
                                        الجلسة.{""}
                                    </h5>
                                </div>
                                <div className='flex items-start gap-2'>
                                    <svg className='fill-primary w-14' xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 64 64' data-name='Layer 1'>
                                        <path d='m4 35c18.621 4.21 20 23 20 23s1.379-18.79 20-23c-18.621-4.21-20-23-20-23s-1.379 18.79-20 23z' />
                                        <path d='m38 48c10.241 2.2 11 12 11 12s.759-9.8 11-12c-10.241-2.2-11-12-11-12s-.759 9.8-11 12z' />
                                        <path d='m31 16c10.241 2.2 11 12 11 12s.759-9.8 11-12c-10.241-2.2-11-12-11-12s-.759 9.8-11 12z' />
                                    </svg>
                                    <h5 className='text-primary lg:text-xl text-justify'>
                                        <span className='font-bold text-secondaryDark '>متابعة إضافية:</span> نقدم متابعة قصيرة لمدة يومين عبر البريد الإلكتروني أو الرسائل النصية
                                        للإجابة على أي استفسارات إضافية قد تكون لديك.{""}
                                    </h5>
                                </div>
                                <div className='flex items-start gap-2'>
                                    <svg className='fill-primary w-14' xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 64 64' data-name='Layer 1'>
                                        <path d='m4 35c18.621 4.21 20 23 20 23s1.379-18.79 20-23c-18.621-4.21-20-23-20-23s-1.379 18.79-20 23z' />
                                        <path d='m38 48c10.241 2.2 11 12 11 12s.759-9.8 11-12c-10.241-2.2-11-12-11-12s-.759 9.8-11 12z' />
                                        <path d='m31 16c10.241 2.2 11 12 11 12s.759-9.8 11-12c-10.241-2.2-11-12-11-12s-.759 9.8-11 12z' />
                                    </svg>
                                    <h5 className='text-primary lg:text-xl text-justify'>
                                        <span className='font-bold text-secondaryDark '>موارد مفيدة:</span> نزودك بروابط لمصادر مفيدة تتناسب مع استشارتك لتعزيز فهمك وتمدك
                                        بالمعلومات المطلوبة.{""}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='basis-1/2 flex justify-end order-first lg:order-last'>
                        <img data-aos='fade-right' className='feature-img' src={featureImg} alt='' />
                    </div>
                </div>
            </section>

            {/* PAYMENT METHOD */}
            <section id='method' className='my-container bg-primaryLight'>
                <div className='flex flex-col gap-10'>
                    {/* Title and Subtitle */}
                    <div className='text-center'>
                        <h2 className='text-3xl font-bold text-primary mb-4'>كيفية الحصول على استشارة</h2>
                        <h5 className='text-secondaryDark'>اتبع الخطوات التالية لإتمام عملية الدفع بنجاح من اجل الحصول على استشارة</h5>
                    </div>
                    <ol className='mb-10 items-start flex sm:flex-row flex-col gap-10 md:gap-0'>
                        <li data-aos='fade-down' className='relative basis-1/3 method'>
                            <div className='flex items-center justify-center'>
                                <div className='z-10 flex items-center justify-center w-10 h-10 bg-primary rounded-full ring-0 ring-whity sm:ring-8 shrink-0'>
                                    <h5 className='font-bold md:text-start text-center'>1</h5>
                                </div>
                                <div className='hidden sm:flex w-full bg-whity h-0.5 dark:bg-gray-700' />
                            </div>
                            <div className='mt-3 sm:pe-8 flex flex-col sm:items-start items-center justify-between h-full md:gap-0 gap-4'>
                                <div className='flex flex-col gap-3'>
                                    <h5 className=' font-bold text-primary text-center md:text-justify'>ادفع</h5>
                                    <p className='md:text-base text-lg font-semibold text-primary text-center md:text-justify'>
                                        {" "}
                                        ادفع ثمن الخدمة عن طريق بايبال للحساب التالي : MaramWahibi
                                    </p>
                                </div>
                                <a href='https://www.paypal.com/paypalme/MaramWahibi'>
                                    <button className='bg-secondaryDark hover:bg-secondary transition-all duration-300 w-32 h-11 rounded-full text-base text-whity'>
                                        الذهاب للحساب
                                    </button>
                                </a>
                            </div>
                        </li>
                        <li data-aos='fade-up' className='relative basis-1/3 method'>
                            <div className='flex items-center justify-center'>
                                <div className='z-10 flex items-center justify-center w-10 h-10 bg-primary rounded-full ring-0 ring-whity sm:ring-8 shrink-0'>
                                    <h5 className='font-bold md:text-start text-center'>2</h5>
                                </div>
                                <div className='hidden sm:flex w-full bg-whity h-0.5 dark:bg-gray-700' />
                            </div>
                            <div className='mt-3 sm:pe-8 flex flex-col sm:items-start items-center justify-between h-full md:gap-0 gap-4'>
                                <div className='flex flex-col gap-3'>
                                    <h5 className=' font-bold text-primary text-center md:text-justify'>ارفق</h5>
                                    <p className='md:text-base text-lg font-semibold text-primary text-center md:text-justify'>
                                        خذ لقطة للشاشة بعد الدفع تظهر المبلغ و الحساب الخاص بك و من ثم ارفق صورة اللقطة التي اخذت عبر نموذج التسجيل
                                    </p>
                                </div>
                                <a href='#form'>
                                    <button className='bg-secondaryDark hover:bg-secondary transition-all duration-300 w-32 h-11 rounded-full text-base text-whity'>
                                        ارفق الصورة
                                    </button>
                                </a>
                            </div>
                        </li>
                        <li data-aos='fade-down' className='relative basis-1/3 method'>
                            <div className='flex items-center justify-center'>
                                <div className='z-10 flex items-center justify-center w-10 h-10 bg-primary rounded-full ring-0 ring-whity sm:ring-8 shrink-0'>
                                    <h5 className='font-bold md:text-start text-center'>3</h5>
                                </div>
                                <div className='hidden sm:flex w-full bg-whity h-0.5 dark:bg-gray-700' />
                            </div>
                            <div className='mt-3 sm:pe-8 flex flex-col sm:items-start items-center justify-between h-full md:gap-0 gap-4'>
                                <div className='flex flex-col gap-3'>
                                    <h5 className=' font-bold text-primary text-center md:text-justify'>سجل</h5>
                                    <p className='md:text-base text-lg font-semibold text-primary text-center md:text-justify'>
                                        سجل عبر نموذج التسجيل و اذكر الخدمة المطلوبة ولا تنسي ارفاق الصورة الخاصة ب الدفع
                                    </p>
                                </div>
                                <a href='#form'>
                                    <button className='bg-secondaryDark hover:bg-secondary transition-all duration-300 w-32 h-11 rounded-full text-base text-whity'>
                                        نموذج التسجيل
                                    </button>
                                </a>
                            </div>
                        </li>
                    </ol>

                    <div className='flex justify-center items-center'>
                        <h6 className='text-center text-primary'>يمكنك الدفع عبر الحساب البنكي اذا لم يكن لديك حساب Paypal</h6>
                    </div>
                </div>
            </section>

            {/* FORM */}
            <section id='form'>
                <h2 className='block md:hidden text-center text-primary monadi pt-10 pb-8'>سجل الان و احصل على استشارتك للسفر الى ايسلندا</h2>
                <div className='flex md:flex-row flex-col'>
                    <div data-aos='fade-left' className='my-container flex items-center justify-center bg-whity basis-1/2'>
                        <h2 className='hidden md:block leading-normal text-center text-primary monadi mb-8'>سجل الان و احصل على استشارتك للسفر الى ايسلندا</h2>
                        <div className='rounded-lg w-full'>
                            <form encType='multipart/form-data' method='post' onSubmit={formik.handleSubmit}>
                                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
                                    {/* First name input */}
                                    <div className='relative mb-6'>
                                        <input
                                            name='first_name'
                                            type='text'
                                            className={`peer peer-focus:outline outline ${
                                                formik.touched.firstName && formik.errors.firstName ? "outline-red-300" : "outline-primaryLight"
                                            } block min-h-[auto] w-full rounded-full border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary`}
                                            id='firstName'
                                            aria-describedby='firstName'
                                            {...formik.getFieldProps("firstName")}
                                        />
                                        <label
                                            htmlFor='firstName'
                                            className='pointer-events-none bg-whity absolute right-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary'
                                        >
                                            {formik.values.firstName === "" ? "الاسم الاول" : ""}
                                        </label>
                                        {formik.touched.firstName && formik.errors.firstName ? <div className='text-red-500 text-xs px-3'>{formik.errors.firstName}</div> : null}
                                    </div>

                                    {/* Last name input */}
                                    <div className='relative mb-6'>
                                        <input
                                            name='last_name'
                                            type='text'
                                            className={`peer peer-focus:outline outline ${
                                                formik.touched.lastName && formik.errors.lastName ? "outline-red-300" : "outline-primaryLight"
                                            } block min-h-[auto] w-full rounded-full border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary`}
                                            id='lastName'
                                            aria-describedby='lastName'
                                            {...formik.getFieldProps("lastName")}
                                        />
                                        <label
                                            htmlFor='lastName'
                                            className='pointer-events-none bg-whity absolute right-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary'
                                        >
                                            {formik.values.lastName === "" ? "الاسم الاخير" : ""}
                                        </label>
                                        {formik.touched.lastName && formik.errors.lastName ? <div className='text-red-500 text-xs px-3'>{formik.errors.lastName}</div> : null}
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
                                    {/* Service name input */}
                                    <div className='relative mb-6'>
                                        <select
                                            name='serviceName'
                                            className={`peer peer-focus:outline outline ${
                                                formik.touched.serviceName && formik.errors.serviceName ? "outline-red-300" : "outline-primaryLight"
                                            } block min-h-[auto] w-full rounded-full border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary`}
                                            id='serviceName'
                                            aria-describedby='serviceName'
                                            {...formik.getFieldProps("serviceName")}
                                        >
                                            <option value='' label='اختر الخدمة' />
                                            {services.map((service, index) => (
                                                <option key={index} value={service}>
                                                    {service}
                                                </option>
                                            ))}
                                        </select>
                                        <label
                                            htmlFor='serviceName'
                                            className='pointer-events-none bg-whity absolute right-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary'
                                        >
                                            {formik.values.serviceName === "" ? "اسم الخدمة" : ""}
                                        </label>
                                        {formik.touched.serviceName && formik.errors.serviceName ? (
                                            <div className='text-red-500 text-xs px-3'>{formik.errors.serviceName}</div>
                                        ) : null}
                                    </div>

                                    {/* Phone input */}
                                    <div className='relative mb-6'>
                                        <input
                                            name='phone'
                                            type='tel'
                                            className={`peer peer-focus:outline outline ${
                                                formik.touched.phone && formik.errors.phone ? "outline-red-300" : "outline-primaryLight"
                                            } block min-h-[auto] w-full rounded-full border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary`}
                                            id='phone'
                                            aria-describedby='phone'
                                            {...formik.getFieldProps("phone")}
                                        />
                                        <label
                                            htmlFor='phone'
                                            className='pointer-events-none bg-whity absolute right-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary'
                                        >
                                            {formik.values.phone === "" ? "رقم الهاتف" : ""}
                                        </label>
                                        {formik.touched.phone && formik.errors.phone ? <div className='text-red-500 text-xs px-3'>{formik.errors.phone}</div> : null}
                                    </div>
                                </div>

                                {/* Email input */}
                                <div className='relative mb-6'>
                                    <input
                                        name='email'
                                        type='email'
                                        className={`peer peer-focus:outline outline ${
                                            formik.touched.email && formik.errors.email ? "outline-red-300" : "outline-primaryLight"
                                        } block min-h-[auto] w-full rounded-full border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary`}
                                        id='email'
                                        aria-describedby='email'
                                        {...formik.getFieldProps("email")}
                                    />
                                    <label
                                        htmlFor='email'
                                        className='pointer-events-none bg-whity absolute right-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary'
                                    >
                                        {formik.values.email === "" ? "البريد الالكتروني" : ""}
                                    </label>
                                    {formik.touched.email && formik.errors.email ? <div className='text-red-500 text-xs px-3'>{formik.errors.email}</div> : null}
                                </div>

                                {/* Image input */}
                                <div className='relative mb-6'>
                                    <input
                                        name='image'
                                        type='file'
                                        id='image'
                                        className='hidden'
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            formik.setFieldValue("image", file);
                                            const fileName = file ? file.name : "لا يوجد ملف مختار";
                                            document.getElementById("fileLabel").innerText = fileName;
                                            document.getElementById("removeFileIcon").classList.remove("hidden");
                                            document.getElementById("removeFileIcon").classList.add("flex");
                                        }}
                                    />
                                    <div className='flex gap-4 m-5 items-center'>
                                        <svg className='h-8 fill-primary' id='fi_3342137' enableBackground='new 0 0 24 24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                            <g>
                                                <path d='m17.453 24c-.168 0-.34-.021-.51-.066l-15.463-4.141c-1.06-.292-1.692-1.39-1.414-2.45l1.951-7.272c.072-.267.346-.422.612-.354.267.071.425.346.354.612l-1.95 7.27c-.139.53.179 1.082.71 1.229l15.457 4.139c.531.14 1.079-.176 1.217-.704l.781-2.894c.072-.267.346-.426.613-.353.267.072.424.347.353.613l-.78 2.89c-.235.89-1.045 1.481-1.931 1.481z' />
                                            </g>
                                            <g>
                                                <path d='m22 18h-16c-1.103 0-2-.897-2-2v-12c0-1.103.897-2 2-2h16c1.103 0 2 .897 2 2v12c0 1.103-.897 2-2 2zm-16-15c-.551 0-1 .449-1 1v12c0 .551.449 1 1 1h16c.551 0 1-.449 1-1v-12c0-.551-.449-1-1-1z' />
                                            </g>
                                            <g>
                                                <path d='m9 9c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-3c-.551 0-1 .449-1 1s.449 1 1 1 1-.449 1-1-.449-1-1-1z' />
                                            </g>
                                            <g>
                                                <path d='m4.57 16.93c-.128 0-.256-.049-.354-.146-.195-.195-.195-.512 0-.707l4.723-4.723c.566-.566 1.555-.566 2.121 0l1.406 1.406 3.892-4.67c.283-.339.699-.536 1.142-.54h.011c.438 0 .853.19 1.139.523l5.23 6.102c.18.209.156.525-.054.705-.209.18-.524.157-.705-.054l-5.23-6.102c-.097-.112-.231-.174-.38-.174-.104-.009-.287.063-.384.18l-4.243 5.091c-.09.108-.221.173-.362.179-.142.01-.277-.046-.376-.146l-1.793-1.793c-.189-.188-.518-.188-.707 0l-4.723 4.723c-.097.097-.225.146-.353.146z' />
                                            </g>
                                        </svg>
                                        <label
                                            htmlFor='image'
                                            id='fileLabel'
                                            className='peer flex cursor-pointer items-center justify-center min-h-[auto] hover:bg-secondary text-whity rounded border-0 bg-secondaryDark px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-whity dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0'
                                        >
                                            ارفق الصورة
                                        </label>
                                        <span
                                            id='removeFileIcon'
                                            className='hidden justify-center items-center rounded-full absolute left-0 top-2 font-black cursor-pointer text-primary w-5 h-5 bg-primaryDark'
                                            onClick={() => {
                                                formik.setFieldValue("image", null);
                                                document.getElementById("image").value = "";
                                                document.getElementById("fileLabel").innerText = "اختر ملف";
                                                document.getElementById("removeFileIcon").classList.add("hidden");
                                                document.getElementById("fileLabel").classList.remove("w-[90%]");
                                                document.getElementById("removeFileIcon").classList.remove("flex");
                                            }}
                                        >
                                            &times;
                                        </span>
                                    </div>
                                    {formik.touched.image && formik.errors.image ? <div className='text-red-500 text-xs px-3'>{formik.errors.image}</div> : null}
                                </div>

                                {/* Submit button */}
                                <button 
                                    type='submit'
                                    className='inline-block w-full rounded-full bg-primary px-6 pb-2 pt-2.5 h-12 text-md font-medium uppercase leading-normal text-whity shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2'
                                >
                                    سجل الان
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className='basis-1/2 md:order-last order-first'>
                        <img className='h-full' src={formImg} alt='' />
                    </div>
                </div>
            </section>

            {/* CONTACT US */}
            <section className='my-container gap-10 bg-primaryLight'>
                <div className='flex flex-col gap-6 items-center justify-center'>
                    <div data-aos='fade-left' id='contactus'>
                        <h1 className='text-primary text-center monadi mb-4 '>تواصل معنا</h1>
                        <h4 className='lg:my-0 my-2 text-secondaryDark font-semibold text-center tracking-wide leading-6'>
                            اذا وجدت اي صعوبة او مشكلة في الاشتراك في الخدمة يمكنك التواصل معنا و متابعتنا عبر
                            <span className='font-black'> {""}الانستجرام</span>
                        </h4>
                    </div>
                    <a href='https://www.instagram.com/maramiceland/'>
                        <button className='bg-primary heartbeat w-44 h-14 rounded-full text-whity'>الذهاب للانستجرام</button>
                    </a>
                    {/* <div className='contact-container md:flex-row flex-col w-full gap-10'>
                        <a data-aos='fade-up' href='https://www.instagram.com/maramiceland/' className='container'>
                            <div className='gradient-background' />
                            <div className='content bg-whity'>
                                <svg
                                    className='h-10 fill-primary'
                                    version='1.1'
                                    id='fi_717392'
                                    xmlns='http://www.w3.org/2000/svg'
                                    xmlnsXlink='http://www.w3.org/1999/xlink'
                                    x='0px'
                                    y='0px'
                                    viewBox='0 0 409.61 409.61'
                                    style={{ enableBackground: "new 0 0 409.61 409.61" }}
                                    xmlSpace='preserve'
                                >
                                    <g>
                                        <g>
                                            <path
                                                d='M307.205,0h-204.8C46.09,0,0.005,46.085,0.005,102.4v204.81c0,56.3,46.085,102.4,102.4,102.4h204.8
			c56.315,0,102.4-46.1,102.4-102.4V102.4C409.605,46.085,363.52,0,307.205,0z M375.47,307.21c0,37.632-30.612,68.265-68.265,68.265
			h-204.8c-37.637,0-68.265-30.633-68.265-68.265V102.4c0-37.642,30.628-68.265,68.265-68.265h204.8
			c37.653,0,68.265,30.623,68.265,68.265V307.21z'
                                            />
                                        </g>
                                    </g>
                                    <g>
                                        <g>
                                            <circle cx='315.755' cy='93.865' r='25.6' />
                                        </g>
                                    </g>
                                    <g>
                                        <g>
                                            <path
                                                d='M204.805,102.4c-56.566,0-102.4,45.839-102.4,102.4c0,56.54,45.834,102.41,102.4,102.41c56.55,0,102.4-45.87,102.4-102.41
			C307.205,148.239,261.355,102.4,204.805,102.4z M204.805,273.075c-37.699,0-68.265-30.566-68.265-68.275
			s30.566-68.265,68.265-68.265s68.265,30.556,68.265,68.265S242.504,273.075,204.805,273.075z'
                                            />
                                        </g>
                                    </g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                    <g></g>
                                </svg>
                                <a href='https://www.instagram.com/maramiceland/'>
                                    <h6 className='pt-3 contact text-primary font-semibold'>maramiceland</h6>
                                </a>
                            </div>
                        </a>
                    </div> */}
                </div>
            </section>
            <ToastContainer />
        </>
    );
}

export default Hero;
