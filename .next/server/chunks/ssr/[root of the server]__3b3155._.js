module.exports = {

"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/Context/LayoutContext.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "LayoutProvider": (()=>LayoutProvider),
    "useLayout": (()=>useLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const LayoutContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const LayoutProvider = ({ children, title = 'Home', description = '', backLink, lgLogoShow = true, logoShow = true })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LayoutContext.Provider, {
        value: {
            title,
            description,
            backLink,
            lgLogoShow,
            logoShow
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Context/LayoutContext.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
};
const useLayout = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};
}}),
"[project]/src/Components/LiveBG.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "LiveBGMain": (()=>LiveBGMain),
    "LiveBGStatic": (()=>LiveBGStatic)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const LiveBGMain = ({ itemNumber })=>{
    const [positions, setPositions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(Array.from({
        length: itemNumber
    }, ()=>({
            top: "50%",
            left: "50%"
        })));
    const getSecureRandomPercentage = (excludeStart, excludeEnd)=>{
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        let percentage = array[0] % 101; // Random number between 0 and 100
        // Adjust to avoid excluded range
        if (percentage >= excludeStart && percentage <= excludeEnd) {
            // Randomly decide whether to shift the percentage to before or after the excluded range
            const shiftUp = Math.random() > 0.5;
            percentage = shiftUp ? excludeEnd + (percentage - excludeStart) : excludeStart - (excludeEnd - percentage);
        }
        return Math.max(0, Math.min(percentage, 100)); // Ensure percentage stays within 0-100
    };
    const randomizePositions = ()=>{
        const centerWidth = 300; // Width of the excluded central square
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // Calculate exclusion range as a percentage of viewport size
        const excludeStartX = (viewportWidth / 2 - centerWidth / 2) / viewportWidth * 100;
        const excludeEndX = (viewportWidth / 2 + centerWidth / 2) / viewportWidth * 100;
        const excludeStartY = (viewportHeight / 2 - centerWidth / 2) / viewportHeight * 100;
        const excludeEndY = (viewportHeight / 2 + centerWidth / 2) / viewportHeight * 100;
        return positions.map(()=>({
                top: `${getSecureRandomPercentage(excludeStartY, excludeEndY)}%`,
                left: `${getSecureRandomPercentage(excludeStartX, excludeEndX)}%`
            }));
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Randomize positions on component mount
        setPositions(randomizePositions());
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full h-full bottom-0 absolute z-0 grid place-items-center`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative w-full h-full filter blur-[8px] md:blur-md p-32`,
            children: positions.map((position, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: `absolute w-28 sm:w-32 md:w-44 lg:w-60 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary`,
                    viewBox: "0 0 177 195",
                    style: {
                        top: position.top,
                        left: position.left,
                        animationDelay: `${index * 1000}ms`
                    },
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
                    }, void 0, false, {
                        fileName: "[project]/src/Components/LiveBG.tsx",
                        lineNumber: 65,
                        columnNumber: 15
                    }, this)
                }, index, false, {
                    fileName: "[project]/src/Components/LiveBG.tsx",
                    lineNumber: 56,
                    columnNumber: 13
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/Components/LiveBG.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Components/LiveBG.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
};
const LiveBGStatic = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full h-full bottom-0 absolute z-0 grid place-items-center`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative w-full h-full filter blur-2xl p-32`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: `absolute w-60 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary`,
                    viewBox: "0 0 177 195",
                    style: {
                        top: `5%`,
                        left: `25%`,
                        animationDelay: `300ms`
                    },
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
                    }, void 0, false, {
                        fileName: "[project]/src/Components/LiveBG.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Components/LiveBG.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: `absolute w-60 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary md:fill-pj-accent`,
                    viewBox: "0 0 177 195",
                    style: {
                        top: `20%`,
                        left: `3%`
                    },
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
                    }, void 0, false, {
                        fileName: "[project]/src/Components/LiveBG.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Components/LiveBG.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: `absolute w-96 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-accent`,
                    viewBox: "0 0 177 195",
                    style: {
                        top: `0%`,
                        right: `3%`,
                        animationDelay: `800ms`
                    },
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
                    }, void 0, false, {
                        fileName: "[project]/src/Components/LiveBG.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Components/LiveBG.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: `absolute w-60 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary`,
                    viewBox: "0 0 177 195",
                    style: {
                        top: `40%`,
                        left: `75%`,
                        animationDelay: `2500ms`
                    },
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
                    }, void 0, false, {
                        fileName: "[project]/src/Components/LiveBG.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Components/LiveBG.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Components/LiveBG.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Components/LiveBG.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
};
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component, client modules ssr)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__3b3155._.js.map