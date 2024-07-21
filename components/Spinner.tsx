
"use client";


export default function Spinner() {
    return (
        <svg
            viewBox="0 0 512 512"
            style={{ color: "black" }}
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
        >
            <rect
                width="512"
                height="512"
                x="0"
                y="0"
                rx="30"
                fill="transparent"
                stroke="transparent"
                strokeWidth="0"
                strokeOpacity="100%"
                paintOrder="stroke"
            ></rect>
            <svg
                width="256px"
                height="256px"
                viewBox="0 0 24 24"
                fill="currentColor"
                x="128"
                y="128"
                role="img"
                style={{ display: "inline-block", verticalAlign: "middle" }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <g fill="currentColor">
                    <defs>
                        <filter id="svgSpinnersGooeyBalls20">
                            <feGaussianBlur in="SourceGraphic" result="y" stdDeviation="1" />
                            <feColorMatrix
                                in="y"
                                result="z"
                                values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
                            />
                            <feBlend in="SourceGraphic" in2="z" />
                        </filter>
                    </defs>
                    <g filter="url(#svgSpinnersGooeyBalls20)">
                        <circle cx="5" cy="12" r="4" fill="currentColor">
                            <animate
                                attributeName="cx"
                                calcMode="spline"
                                dur="2s"
                                keySplines=".36,.62,.43,.99;.79,0,.58,.57"
                                repeatCount="indefinite"
                                values="5;8;5"
                            />
                        </circle>
                        <circle cx="19" cy="12" r="4" fill="currentColor">
                            <animate
                                attributeName="cx"
                                calcMode="spline"
                                dur="2s"
                                keySplines=".36,.62,.43,.99;.79,0,.58,.57"
                                repeatCount="indefinite"
                                values="19;16;19"
                            />
                        </circle>
                        <animateTransform
                            attributeName="transform"
                            dur="0.75s"
                            repeatCount="indefinite"
                            type="rotate"
                            values="0 12 12;360 12 12"
                        />
                    </g>
                </g>
            </svg>
        </svg>
    );
}
