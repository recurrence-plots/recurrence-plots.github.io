import React from 'react';
import { clsx } from 'clsx';

const Section = ({ id, children, className, containerClassName }) => {
    return (
        <section id={id} className={clsx("py-24 px-6", className)}>
            <div className={clsx("max-w-6xl mx-auto", containerClassName)}>
                {children}
            </div>
        </section>
    );
};

export default Section;
