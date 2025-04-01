// global.d.ts
declare global {
    interface Window {
        VANTA: any; // You can refine this type if you know Vanta's structure
        p5: any;    // Same for p5.js
    }
}