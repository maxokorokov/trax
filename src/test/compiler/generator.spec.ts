// trax:ignore
import * as assert from 'assert';
import { generate } from '../../trax/compiler/generator';

describe('Generator', () => {

    it("should support simple types", async function () {
        assert.equal(generate(`
            import { Data } from "./trax";

            @Data class Address {
                street: string
                zipCode: number;
                valid: boolean;
            }
        `, 'myFile.ts'), `
            import { ΔD, ΔfStr, Δp, ΔfNbr, ΔfBool } from "./trax";

            @ΔD class Address {
                ΔΔstreet: string; @Δp(ΔfStr) street: string;
                ΔΔzipCode: number; @Δp(ΔfNbr) zipCode: number;
                ΔΔvalid: boolean; @Δp(ΔfBool) valid: boolean;
            }
        `, "1");
    });

    it("should support types that can be null", async function () {
        assert.equal(generate(`
            import { Data } from "./trax";

            @Data class Address {
                street: string | null
                valid: boolean  | null;
            }
        `, 'myFile.ts'), `
            import { ΔD, ΔfStr, Δp, ΔfBool } from "./trax";

            @ΔD class Address {
                ΔΔstreet: string | null; @Δp(ΔfStr, 1) street: string | null;
                ΔΔvalid: boolean  | null; @Δp(ΔfBool, 1) valid: boolean | null;
            }
        `, "1");
    });

    it("should support Data object types", async function () {
        assert.equal(generate(`
            import { Data } from "./trax";

            @Data class Foo {
                sth: string;
            }

            @Data class Bar {
                theFoo: Foo
            }
        `, 'myFile.ts'), `
            import { ΔD, ΔfStr, Δp, Δf } from "./trax";

            @ΔD class Foo {
                ΔΔsth: string; @Δp(ΔfStr) sth: string;
            }

            @ΔD class Bar {
                ΔΔtheFoo: Foo; @Δp(Δf(Foo)) theFoo: Foo;
            }
        `, "1");
    });

    it("should support types that can be null", async function () {
        assert.equal(generate(`
            import { Data } from "./trax";

            @Data class Address {
                streets: string[]
                bar: Bar[] | null;
                baz: Bar[][] | null;
            }
        `, 'myFile.ts'), `
            import { ΔD, ΔfStr, Δlf, Δp, Δf } from "./trax";

            @ΔD class Address {
                ΔΔstreets: string[]; @Δp(Δlf(ΔfStr)) streets: string[];
                ΔΔbar: Bar[] | null; @Δp(Δlf(Δf(Bar)), 1) bar: Bar[] | null;
                ΔΔbaz: Bar[][] | null; @Δp(Δlf(Δlf(Δf(Bar))), 1) baz: Bar[][] | null;
            }
        `, "1");
    });

    it("should support Arrays with item types that can be null", async function () {
        assert.equal(generate(`
            import { Data } from "./trax";

            @Data class Address {
                bar: (Bar | null)[]
            }
        `, 'myFile.ts'), `
            import { ΔD, Δf, Δlf, Δp } from "./trax";

            @ΔD class Address {
                ΔΔbar: (Bar | null)[]; @Δp(Δlf(Δf(Bar))) bar: (Bar | null)[];
            }
        `, "1");
    });

    // todo support import Data from "./trax" -> default import ?;
});