import pytest
from writer import spool


@pytest.mark.parametrize('size, case, expected', [
    (
        2,
        [0, 1, 2, 3],
        [[0, 1], [2, 3]],
    ),
    (
        25,
        range(50),
        [list(range(0, 25)), list(range(25, 50))]
    ),
    (
        3,
        range(10),
        [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]],
    ),
])
def test_spool(size, case, expected):
    """Just make sure the spool function is working as intended."""
    assert list(spool(case, size=size)) == expected
