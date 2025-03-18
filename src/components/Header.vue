<template>
    <header> 
        <div class = "logo">
            <img src = "../assets/header/clinic-logo.svg" alt = "St. Rupert Medical Clinic logo">
            <span>
                <h1>St. Rupert</h1>
                <p>Medical Clinic</p>
            </span>
        </div>
        <nav>
            <ul>
                <li><a href = "#">HOME</a></li>
                <li><a href = "#">OUR SERVICES</a></li>
                <li><a href = "#">FAQs</a></li>
                <li><a href = "#">ABOUT US</a></li>
            </ul>
        </nav>
    </header>
</template>

<script>

</script>

<style lang = "scss">
@use "@/styles/variables.scss" as vars;
@import 'normalize.css';

header {
    height: 10vw;
    width: 100%;
    background-color: vars.$header-color;
    font-family: vars.$font-family;
    color: vars.$header-font-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    
    .logo {
        display: flex;
        align-items: center;
        gap: 3%; 
        padding: 3%;

        img {
            object-fit: contain;
        }

        span {
            line-height: 0.25;

            h1 {
                font-size: 2rem;
                white-space: nowrap;
            }

            p {
                text-align: right;
            }
        }
    }

    nav ul {
        font-weight: 500;
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;

        li {
            margin: 0 50px;
            font-size: 1rem;
            width: auto;
        }

        a {
            text-decoration: none;
            color: vars.$header-font-color;

            &:hover {
                color: #0284C7;
                transition: color 0.2s ease-in-out;
            }
        }
    }
}
</style>