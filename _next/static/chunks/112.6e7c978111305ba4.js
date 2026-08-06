"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[112],{1138:(e,t,n)=>{n.d(t,{v:()=>l});var r=n(2115),a=n(490);let o=e=>{let t=(0,a.y)(e),n=e=>(function(e,t=e=>e){let n=r.useSyncExternalStore(e.subscribe,r.useCallback(()=>t(e.getState()),[e,t]),r.useCallback(()=>t(e.getInitialState()),[e,t]));return r.useDebugValue(n),n})(t,e);return Object.assign(n,t),n},l=e=>e?o(e):o},3617:(e,t,n)=>{n.d(t,{o:()=>a});var r=n(5339);class a{setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}}new r.qUd(-1,1,1,-1,0,1);class o extends r.LoY{constructor(){super(),this.setAttribute("position",new r.qtW([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new r.qtW([0,2,0,0,2,0],2))}}new o},6756:(e,t,n)=>{n.d(t,{r:()=>l});var r=n(2115),a=n(3388);let o=(0,r.createContext)(null);function l({iterations:e=10,ms:t=250,threshold:n=.75,step:l=.1,factor:s=.5,flipflops:i=1/0,bounds:u=e=>e>100?[60,100]:[40,60],onIncline:f,onDecline:c,onChange:d,onFallback:p,children:m}){let[h,b]=(0,r.useState)(()=>({fps:0,index:0,factor:s,flipped:0,refreshrate:0,fallback:!1,frames:[],averages:[],subscriptions:new Map,subscribe:e=>{let t=Symbol();return h.subscriptions.set(t,e.current),()=>void h.subscriptions.delete(t)}})),g=0;return(0,a.D)(()=>{let{frames:r,averages:a}=h;if(!h.fallback&&a.length<e){r.push(performance.now());let o=r[r.length-1]-r[0];if(o>=t){if(h.fps=Math.round(r.length/o*1e3)/1,h.refreshrate=Math.max(h.refreshrate,h.fps),a[h.index++%e]=h.fps,a.length===e){let[t,r]=u(h.refreshrate),o=a.filter(e=>e>=r),s=a.filter(e=>e<t);o.length>e*n&&(h.factor=Math.min(1,h.factor+l),h.flipped++,f&&f(h),h.subscriptions.forEach(e=>e.onIncline&&e.onIncline(h))),s.length>e*n&&(h.factor=Math.max(0,h.factor-l),h.flipped++,c&&c(h),h.subscriptions.forEach(e=>e.onDecline&&e.onDecline(h))),g!==h.factor&&(g=h.factor,d&&d(h),h.subscriptions.forEach(e=>e.onChange&&e.onChange(h))),h.flipped>i&&!h.fallback&&(h.fallback=!0,p&&p(h),h.subscriptions.forEach(e=>e.onFallback&&e.onFallback(h))),h.averages=[]}h.frames=[]}}}),r.createElement(o.Provider,{value:h},m)}},7696:(e,t,n)=>{n.d(t,{X:()=>o});var r=n(2115),a=n(3388);function o({pixelated:e}){let t=(0,a.C)(e=>e.gl),n=(0,a.C)(e=>e.internal.active),o=(0,a.C)(e=>e.performance.current),l=(0,a.C)(e=>e.viewport.initialDpr),s=(0,a.C)(e=>e.setDpr);return r.useEffect(()=>{let r=t.domElement;return()=>{n&&s(l),e&&r&&(r.style.imageRendering="auto")}},[]),r.useEffect(()=>{s(o*l),e&&t.domElement&&(t.domElement.style.imageRendering=1===o?"auto":"pixelated")},[o]),null}},8381:(e,t,n)=>{n.d(t,{mK:()=>M,E8:()=>C,b1:()=>S,s0:()=>v,fL:()=>P,nU:()=>_,bt:()=>k,fE:()=>R});var r=n(5155),a=n(2115),o=n(5339),l=n(3388),s=n(3303);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}new o.I9Y,new o.I9Y;function u(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}var f=function e(t,n,r){var a=this;u(this,e),i(this,"dot2",function(e,t){return a.x*e+a.y*t}),i(this,"dot3",function(e,t,n){return a.x*e+a.y*t+a.z*n}),this.x=t,this.y=n,this.z=r},c=[new f(1,1,0),new f(-1,1,0),new f(1,-1,0),new f(-1,-1,0),new f(1,0,1),new f(-1,0,1),new f(1,0,-1),new f(-1,0,-1),new f(0,1,1),new f(0,-1,1),new f(0,1,-1),new f(0,-1,-1)],d=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],p=Array(512),m=Array(512);!function(e){e>0&&e<1&&(e*=65536),(e=Math.floor(e))<256&&(e|=e<<8);for(var t,n=0;n<256;n++)t=1&n?d[n]^255&e:d[n]^e>>8&255,p[n]=p[n+256]=t,m[n]=m[n+256]=c[t%12]}(0);function h(e){var t=function(e){if("number"==typeof e)e=Math.abs(e);else if("string"==typeof e){var t=e;e=0;for(var n=0;n<t.length;n++)e=(e+(n+1)*(t.charCodeAt(n)%96))%0x7fffffff}return 0===e&&(e=311),e}(e);return function(){var e=48271*t%0x7fffffff;return t=e,e/0x7fffffff}}new function e(t){var n=this;u(this,e),i(this,"seed",0),i(this,"init",function(e){n.seed=e,n.value=h(e)}),i(this,"value",h(this.seed)),this.init(t)}(Math.random());o.LoY;n(1948);let b=(0,a.createContext)(null),g=e=>(2&e.getAttributes())==2,v=(0,a.memo)((0,a.forwardRef)(({children:e,camera:t,scene:n,resolutionScale:i,enabled:u=!0,renderPriority:f=1,autoClear:c=!0,depthBuffer:d,enableNormalPass:p,stencilBuffer:m,multisampling:h=8,frameBufferType:v=o.ix0},w)=>{let{gl:x,scene:y,camera:S,size:M}=(0,l.C)(),C=n||y,P=t||S,[_,E,k]=(0,a.useMemo)(()=>{let e=new s.s0(x,{depthBuffer:d,stencilBuffer:m,multisampling:h,frameBufferType:v});e.addPass(new s.AH(C,P));let t=null,n=null;return p&&((n=new s.Xe(C,P)).enabled=!1,e.addPass(n),void 0!==i&&((t=new s.SP({normalBuffer:n.texture,resolutionScale:i})).enabled=!1,e.addPass(t))),[e,n,t]},[P,x,d,m,h,v,C,p,i]);(0,a.useEffect)(()=>_?.setSize(M.width,M.height),[_,M]),(0,l.D)((e,t)=>{if(u){let e=x.autoClear;x.autoClear=c,m&&!c&&x.clearStencil(),_.render(t),x.autoClear=e}},u?f:0);let R=(0,a.useRef)(null);(0,a.useLayoutEffect)(()=>{let e=[],t=R.current.__r3f;if(t&&_){let n=t.children;for(let t=0;t<n.length;t++){let r=n[t].object;if(r instanceof s.Mj){let a=[r];if(!g(r)){let e=null;for(;(e=n[t+1]?.object)instanceof s.Mj&&!g(e);)a.push(e),t++}let o=new s.Vu(P,...a);e.push(o)}else r instanceof s.oF&&e.push(r)}for(let t of e)_?.addPass(t);E&&(E.enabled=!0),k&&(k.enabled=!0)}return()=>{for(let t of e)_?.removePass(t);E&&(E.enabled=!1),k&&(k.enabled=!1)}},[_,e,P,E,k]),(0,a.useEffect)(()=>{let e=x.toneMapping;return x.toneMapping=o.y_p,()=>{x.toneMapping=e}},[x]);let F=(0,a.useMemo)(()=>({composer:_,normalPass:E,downSamplingPass:k,resolutionScale:i,camera:P,scene:C}),[_,E,k,i,P,C]);return(0,a.useImperativeHandle)(w,()=>_,[_]),(0,r.jsx)(b.Provider,{value:F,children:(0,r.jsx)("group",{ref:R,children:e})})})),w=0,x=new WeakMap,y=(e,t)=>function({blendFunction:n=t?.blendFunction,opacity:o=t?.opacity,...s}){let i=x.get(e);if(!i){let t=`@react-three/postprocessing/${e.name}-${w++}`;(0,l.e)({[t]:e}),x.set(e,i=t)}let u=(0,l.C)(e=>e.camera),f=a.useMemo(()=>[...t?.args??[],...s.args??[{...t,...s}]],[JSON.stringify(s)]);return(0,r.jsx)(i,{camera:u,"blendMode-blendFunction":n,"blendMode-opacity-value":o,...s,args:f})},S=(0,a.forwardRef)(function({blendFunction:e,worldFocusDistance:t,worldFocusRange:n,focusDistance:l,focusRange:i,focalLength:u,bokehScale:f,resolutionScale:c,resolutionX:d,resolutionY:p,width:m,height:h,target:g,depthTexture:v,...w},x){let{camera:y}=(0,a.useContext)(b),S=null!=g,M=(0,a.useMemo)(()=>{let r=new s.kt(y,{blendFunction:e,worldFocusDistance:t,worldFocusRange:n,focusDistance:l,focusRange:i,focalLength:u,bokehScale:f,resolutionScale:c,resolutionX:d,resolutionY:p,width:m,height:h});return S&&(r.target=new o.Pq0),v&&r.setDepthTexture(v.texture,v.packing),r.maskPass.maskFunction=s.qM.MULTIPLY_RGB_SET_ALPHA,r},[y,e,t,n,l,i,u,f,c,d,p,m,h,S,v]);return(0,a.useEffect)(()=>()=>{M.dispose()},[M]),(0,r.jsx)("primitive",{...w,ref:x,object:M,target:g})});s.Mj;let M=y(s.bv,{blendFunction:0}),C=y(s.t$),P=y(s.i,{blendFunction:5}),_=(s.hH,(0,a.forwardRef)(function(e,t){let{camera:n,normalPass:o,downSamplingPass:l,resolutionScale:i}=(0,a.useContext)(b),u=(0,a.useMemo)(()=>null===o&&null===l?(console.error("Please enable the NormalPass in the EffectComposer in order to use SSAO."),{}):new s.w2(n,o&&!l?o.texture:null,{blendFunction:21,samples:30,rings:4,distanceThreshold:1,distanceFalloff:0,rangeThreshold:.5,rangeFalloff:.1,luminanceInfluence:.9,radius:20,bias:.5,intensity:1,color:void 0,normalDepthBuffer:l?l.texture:null,resolutionScale:i??1,depthAwareUpsampling:!0,...e}),[n,l,o,i]);return(0,r.jsx)("primitive",{ref:t,object:u,dispose:null})}));var E=(e=>(e[e.Linear=0]="Linear",e[e.Radial=1]="Radial",e[e.MirroredLinear=2]="MirroredLinear",e))(E||{});s.Mj;let k=y(s.i4),R=y(s.K1),F=(s.To,{fragmentShader:`

    // original shader by Evan Wallace

    #define MAX_ITERATIONS 100

    uniform float blur;
    uniform float taper;
    uniform vec2 start;
    uniform vec2 end;
    uniform vec2 direction;
    uniform int samples;

    float random(vec3 scale, float seed) {
        /* use the fragment position for a different seed per-pixel */
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 color = vec4(0.0);
        float total = 0.0;
        vec2 startPixel = vec2(start.x * resolution.x, start.y * resolution.y);
        vec2 endPixel = vec2(end.x * resolution.x, end.y * resolution.y);
        float f_samples = float(samples);
        float half_samples = f_samples / 2.0;

        // use screen diagonal to normalize blur radii
        float maxScreenDistance = distance(vec2(0.0), resolution); // diagonal distance
        float gradientRadius = taper * (maxScreenDistance);
        float blurRadius = blur * (maxScreenDistance / 16.0);

        /* randomize the lookup values to hide the fixed number of samples */
        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
        vec2 normal = normalize(vec2(startPixel.y - endPixel.y, endPixel.x - startPixel.x));
        float radius = smoothstep(0.0, 1.0, abs(dot(uv * resolution - startPixel, normal)) / gradientRadius) * blurRadius;

        #pragma unroll_loop_start
        for (int i = 0; i <= MAX_ITERATIONS; i++) {
            if (i >= samples) { break; } // return early if over sample count
            float f_i = float(i);
            float s_i = -half_samples + f_i;
            float percent = (s_i + offset - 0.5) / half_samples;
            float weight = 1.0 - abs(percent);
            vec4 sample_i = texture2D(inputBuffer, uv + normalize(direction) / resolution * percent * radius);
            /* switch to pre-multiplied alpha to correctly blur transparent images */
            sample_i.rgb *= sample_i.a;
            color += sample_i * weight;
            total += weight;
        }
        #pragma unroll_loop_end

        outputColor = color / total;

        /* switch back from pre-multiplied alpha */
        outputColor.rgb /= outputColor.a + 0.00001;
    }
    `});s.Mj;s.Mj;s.Mj}}]);