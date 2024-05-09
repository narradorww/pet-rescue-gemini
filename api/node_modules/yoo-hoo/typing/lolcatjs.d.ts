declare module "lolcatjs" {
    namespace lolcatjs {
        function fromString(s: string): string;
        function println(s: string): void;
        function fromPipe(): Promise<void>;
        function fromFile(file: string): Promise<void>;

        export interface options {
            // To animate or not (only works if the sleep module is available)
            animate: boolean,
            // Duration of the animation
            duration: number,
            // Seed of the rainbow, use the same for the same pattern
            seed: number,
            // Animation speed
            speed: number,
            // Spread of the rainbow
            spread: number,
            // Frequency of the rainbow colors
            freq: number,
        }
    }

    export = lolcatjs;
}