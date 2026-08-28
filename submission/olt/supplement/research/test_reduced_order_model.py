import unittest

import numpy as np

from reduced_order_model import (
    make_grid,
    paired_initial_field,
    selective_mobility,
    simulate,
    verify_cosine_mode,
)


class ReducedOrderModelTests(unittest.TestCase):
    def test_fields_are_finite_and_normalized(self):
        grid = make_grid(65)
        for polarity in ("opposite", "same"):
            field = paired_initial_field(grid, polarity=polarity)
            self.assertTrue(np.isfinite(field).all())
            self.assertAlmostEqual(float(np.max(np.abs(field))), 1.0, places=12)

    def test_energy_is_monotone(self):
        grid = make_grid(65)
        field = paired_initial_field(grid, polarity="opposite")
        mobility = selective_mobility(grid, heat_radius_ratio=0.55)
        result = simulate(field, mobility, grid, da=0.5, sample_times=np.linspace(0, 0.3, 16))
        self.assertTrue(np.all(np.diff(result.energy) <= 1e-12))

    def test_polarity_controls_are_distinguishable(self):
        grid = make_grid(65)
        mobility = selective_mobility(grid, heat_radius_ratio=0.65)
        opposite = simulate(
            paired_initial_field(grid, polarity="opposite"),
            mobility,
            grid,
            da=0.5,
            sample_times=[0.3],
        )
        same = simulate(
            paired_initial_field(grid, polarity="same"),
            mobility,
            grid,
            da=0.5,
            sample_times=[0.3],
        )
        self.assertGreater(abs(float(opposite.energy[-1] - same.energy[-1])), 1e-8)

    def test_cosine_benchmark_converges(self):
        coarse = verify_cosine_mode(33)
        fine = verify_cosine_mode(65)
        self.assertLess(fine["relative_l2_error"], coarse["relative_l2_error"])
        self.assertLess(fine["relative_l2_error"], 0.02)


if __name__ == "__main__":
    unittest.main()
