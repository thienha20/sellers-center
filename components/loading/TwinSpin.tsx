import React from "react"
import styles from "../../assets/styles/modules/twin.module.scss"

interface TwinSpinProps {
    className?: string;
    color?: string;
    width?: number | string;
    height?: number | string;
    duration?: string;
}

const TwinSpin: React.FC<TwinSpinProps & React.HTMLProps<HTMLDivElement>> = ({
                                                                                 className = "",
                                                                                 color = "#0d6efd",
                                                                                 width = "3em",
                                                                                 height = "3em",
                                                                                 style,
                                                                                 duration = "0.6s",
                                                                                 ...others
                                                                             }) => {
    return (
        <div style={{textAlign:"center", marginTop: "20%"}}>
            <div
                {...others}
                style={{
                    "margin": "0 auto",
                    ...style,
                    ["--width" as any]: width,
                    ["--height" as any]: height,
                    ["--color" as any]: color,
                    ["--duration" as any]: duration,

                }}
                className={`${styles.cssfxTwinSpin} ${className}`}
            ></div>
            <p style={{color: color}} className={`mt-3 fw-bolder`}>TAT Seller Center Loading...</p>
        </div>
    );
};

export default TwinSpin;
