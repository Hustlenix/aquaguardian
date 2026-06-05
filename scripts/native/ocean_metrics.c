/*
 * ocean_metrics.c — AquaGuardian native data generator (C99, zero dependencies)
 *
 * WHAT IT IS
 *   A deterministic, seed-driven generator that produces database.json — the
 *   raw collection dataset the app's dev API (src/app/api/stats/route.ts) and
 *   the Python analytics engine (scripts/analyze_ocean_data.py) both consume.
 *   Same seed  =>  byte-identical database.json. Different seed  =>  a
 *   different, still reproducible dataset. The default seed is fixed so a
 *   bare rebuild is stable across machines and CI runs.
 *
 * DATA PIPELINE
 *   ocean_metrics.c ──► database.json ──► analyze_ocean_data.py ──►
 *   src/data/ocean_analysis.json ──► dashboard page
 *
 *   C is a build-time tool here: it cannot run in the browser, but it can
 *   honestly generate the data the web app renders. (WebAssembly could run
 *   C client-side, but that needs an Emscripten toolchain — we keep it lean
 *   and native instead.)
 *
 * BUILD & RUN (any C99 compiler; run from the repo root so database.json
 * lands beside package.json):
 *
 *   gcc -O2 -std=c99 scripts/native/ocean_metrics.c -o scripts/native/ocean_metrics
 *   ./scripts/native/ocean_metrics --seed 42 --events 24
 *
 *   Windows (MSVC):  cl /O2 scripts/native/ocean_metrics.c
 *   then:            scripts\native\ocean_metrics.exe --seed 42 --events 24
 *
 * OPTIONS
 *   --seed N        PRNG seed (default 20260701)
 *   --events N      number of collection events (default 24, max 10000)
 *   --out PATH      output file (default database.json)
 *   --self-test     re-read the file just written and verify its shape
 *   --help          show usage
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define DEFAULT_SEED 20260701
#define DEFAULT_EVENTS 24
#define MAX_EVENTS 10000

static const char *ZONES[] = {
    "Bay of Bengal",
    "Great Pacific Garbage Patch",
    "Gulf of Mexico",
    "Mediterranean Sea",
    "Caribbean Sea",
    "South China Sea",
    "North Atlantic Gyre",
    "Persian Gulf",
    "Baltic Sea",
    "Coral Triangle",
};
#define ZONE_COUNT (sizeof(ZONES) / sizeof(ZONES[0]))

/* xorshift64* — tiny, fast, well-distributed; perfectly fine for data gen. */
typedef struct {
    unsigned long long state;
} Rng;

static unsigned long long splitmix64(unsigned long long *seed) {
    unsigned long long z = (*seed += 0x9E3779B97F4A7C15ULL);
    z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
    z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
    return z ^ (z >> 31);
}

static void rng_seed(Rng *rng, unsigned long long seed) {
    rng->state = splitmix64(&seed); /* guard against all-zero state */
}

static unsigned long long rng_next(Rng *rng) {
    unsigned long long x = rng->state;
    x ^= x >> 12;
    x ^= x << 25;
    x ^= x >> 27;
    rng->state = x;
    return x * 0x2545F4914F6CDD1DULL;
}

/* Uniform integer in [0, bound). */
static unsigned long long rng_range(Rng *rng, unsigned long long bound) {
    return bound ? rng_next(rng) % bound : 0;
}

static void print_usage(const char *prog) {
    printf("Usage: %s [--seed N] [--events N] [--out PATH] [--self-test] [--help]\n",
           prog);
}

int main(int argc, char **argv) {
    unsigned long long seed = DEFAULT_SEED;
    long events = DEFAULT_EVENTS;
    const char *out_path = "database.json";
    int self_test = 0;
    int i;

    for (i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--seed") == 0 && i + 1 < argc) {
            seed = strtoull(argv[++i], NULL, 10);
        } else if (strcmp(argv[i], "--events") == 0 && i + 1 < argc) {
            events = strtol(argv[++i], NULL, 10);
        } else if (strcmp(argv[i], "--out") == 0 && i + 1 < argc) {
            out_path = argv[++i];
        } else if (strcmp(argv[i], "--self-test") == 0) {
            self_test = 1;
        } else if (strcmp(argv[i], "--help") == 0) {
            print_usage(argv[0]);
            return 0;
        } else {
            fprintf(stderr, "unknown option: %s\n", argv[i]);
            print_usage(argv[0]);
            return 2;
        }
    }

    if (events < 1 || events > MAX_EVENTS) {
        fprintf(stderr, "--events must be between 1 and %d (got %ld)\n",
                MAX_EVENTS, events);
        return 2;
    }

    Rng rng;
    rng_seed(&rng, seed);

    /* Collect the dataset in memory first so we can (a) sum totals and
     * (b) self-test the written file against the numbers we emitted. */
    struct {
        long amount;
        const char *zone;
        int day, hour, minute;
    } events_data[MAX_EVENTS];

    long total_plastic = 0;
    for (i = 0; i < events; i++) {
        /* 12..108 pieces per event: enough spread to look like real field
         * data, seeded so it reproduces exactly. */
        long amount = 12 + (long)rng_range(&rng, 97);
        events_data[i].amount = amount;
        events_data[i].zone = ZONES[rng_range(&rng, ZONE_COUNT)];
        events_data[i].day = 1 + (int)rng_range(&rng, 30);   /* July 2026 */
        events_data[i].hour = (int)rng_range(&rng, 24);
        events_data[i].minute = (int)rng_range(&rng, 60);
        total_plastic += amount;
    }

    FILE *out = fopen(out_path, "wb");
    if (!out) {
        fprintf(stderr, "cannot open %s for writing\n", out_path);
        return 1;
    }

    fprintf(out, "{\n");
    fprintf(out, "  \"totalPlastic\": %ld,\n", total_plastic);
    fprintf(out, "  \"collections\": [\n");
    for (i = 0; i < events; i++) {
        fprintf(out, "    {\"amount\": %ld, \"location\": \"%s\", "
                     "\"timestamp\": \"2026-07-%02dT%02d:%02d:00Z\"}%s\n",
                events_data[i].amount, events_data[i].zone,
                events_data[i].day, events_data[i].hour,
                events_data[i].minute, i + 1 < events ? "," : "");
    }
    fprintf(out, "  ]\n");
    fprintf(out, "}\n");
    fclose(out);

    printf("[INFO] ocean_metrics: wrote %s (seed=%llu, events=%ld)\n",
           out_path, seed, events);
    printf("[INFO]   total plastic collected: %ld pieces\n", total_plastic);

    if (self_test) {
        FILE *in = fopen(out_path, "rb");
        if (!in) {
            fprintf(stderr, "[FAIL] self-test: cannot re-open %s\n", out_path);
            return 1;
        }
        fseek(in, 0, SEEK_END);
        long size = ftell(in);
        fseek(in, 0, SEEK_SET);
        char *buf = (char *)malloc((size_t)size + 1);
        if (!buf) {
            fclose(in);
            return 1;
        }
        size_t got = fread(buf, 1, (size_t)size, in);
        buf[got] = '\0';
        fclose(in);

        int ok = 1;
        if (strstr(buf, "\"totalPlastic\"") == NULL ||
            strstr(buf, "\"collections\"") == NULL) {
            ok = 0;
        }
        char expected[64];
        snprintf(expected, sizeof(expected), "\"totalPlastic\": %ld", total_plastic);
        if (strstr(buf, expected) == NULL) {
            ok = 0;
        }
        free(buf);

        if (!ok) {
            fprintf(stderr, "[FAIL] self-test: %s does not match expectations\n",
                    out_path);
            return 1;
        }
        printf("[INFO]   self-test: PASS (file parses, totals match)\n");
    }

    printf("[INFO] next step: python scripts/analyze_ocean_data.py\n");
    return 0;
}
