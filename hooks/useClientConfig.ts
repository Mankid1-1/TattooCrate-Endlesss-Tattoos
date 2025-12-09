import { useState, useEffect } from 'react';
import { ClientConfig } from '../types';

export const useClientConfig = () => {
    const [config, setConfig] = useState<ClientConfig>({
        parlorName: 'TattooCrate Studio',
        mode: 'full',
        theme: {
            accentColor: '#fbbf24',
            backgroundColor: '#0f172a'
        }
    });

    useEffect(() => {
        if (window.TATTOO_CRATE_CONFIG) {
            setConfig(prev => ({
                ...prev,
                ...window.TATTOO_CRATE_CONFIG,
                theme: {
                    ...prev.theme,
                    ...(window.TATTOO_CRATE_CONFIG?.theme || {})
                },
                links: {
                    ...(window.TATTOO_CRATE_CONFIG?.links || {})
                }
            }));
        }
    }, []);

    return config;
};
