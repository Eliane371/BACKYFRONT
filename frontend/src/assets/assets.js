import appointment_img from './calendar-svgrepo-com.svg'
import header_img from './header_img.jpeg'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './system-customer-service-line-svgrepo-com.svg'
import about_image from './about_image.jpg'
import logo from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import jetsky from './jetski.png'
import cuatriciclo from './cuatriciclo.png'
import buceo from './buceo.jpg'
import surfA from './tablasurfadulto.jpg'
import surfN from './tablasurfnino.jpg'
import cJetsky from './jetski-svgrepo-com.svg'
import cCuatri from './motorbike-motorcycle-svgrepo-com.svg'
import cBuceo from './diver-investigate-dive-scuba-dive-svgrepo-com.svg'
import cSurf from './surf-3-svgrepo-com.svg'

export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const categoryData = [
    {
        category: 'Jetsky',
        image: cJetsky
    },
    {
        category: 'Cuatriciclo',
        image: cCuatri
    },
    {
        category: 'Equipo de Buceo',
        image: cBuceo
    },
    {
        category: 'Tabla de surf',
        image: cSurf
    },
]

export const product = [
    {
        p_id: 'jetsky',
        name: 'Jetsky',
        image: jetsky,
        about: 'Alquila un JetSky y siente la adrenalina mientras navegas por las olas, con capacidad para dos personas.',
        fees: 100,
        category: 'Jetsky'
    },
    {
        p_id: 'cuatriciclo',
        name: 'Cuatriciclo',
        image: cuatriciclo,
        about: 'Explora la costa en un cuatriciclo, ideal para aventuras en grupo.',
        fees: 100,
        category: 'Cuatriciclo'
    },
    {
        p_id: 'buceo',
        name: 'Equipo de Buceo',
        image: buceo,
        about: 'Sumérgete en la belleza del océano con nuestro equipo de buceo de alta calidad.',
        fees: 50,
        category: 'Equipo de Buceo'
    },
    {
        p_id: 'surfN',
        name: 'Tabla de Surf Niño',
        image: surfN,
        about: 'Disfruta de las olas en las dos versiones de tabla que ofrecemos para Niños.',
        fees: 15,
        category: 'Tabla de surf'
    },
    {
        p_id: 'surfA',
        name: 'Tabla de Surf Adulto',
        image: surfA,
        about: 'Disfruta de las olas en las dos versiones de tabla que ofrecemos para Adultos.',
        fees: 25,
        category: 'Tabla de surf'
    },
]