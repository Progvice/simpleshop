interface Config {
    mode: string;
    development: {
        host: string;
        protocol: string;
        port: number;
        keys: {
            public: string;
            private: string
        };
        db: {
            mongodb: {};
            mysql: {};
            redis: {}
        }
    };
    production: {
        host: string;
        protocol: string;
        port: number;
        keys: {
            public: string;
            private: string
        };
        db: {
            mongodb: {};
            mysql: {};
            redis: {}
        }
    }
}

export default Config;