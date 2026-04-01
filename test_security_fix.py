import unittest
from unittest.mock import MagicMock, patch
import sys

# Mock dependencies before importing the module
mock_pandas = MagicMock()
sys.modules["pandas"] = mock_pandas
mock_pyodbc = MagicMock()
sys.modules["pyodbc"] = mock_pyodbc

from ejemplo_validador_planning import ValidadorPlanning

class TestSecurityFix(unittest.TestCase):
    def setUp(self):
        self.db_config = {
            'host': 'test_host',
            'port': '50000',
            'database': 'test_db',
            'user': 'test_user',
            'password': 'test_password'
        }
        self.validador = ValidadorPlanning(self.db_config)
        self.validador.connection = MagicMock()

    def test_parameterized_queries(self):
        # Mock read_sql to return empty DataFrames
        mock_pandas.read_sql.return_value = MagicMock() # Mock DataFrame
        # Mocking merge as it is called on the results
        mock_pandas.merge.return_value = MagicMock()

        orden_compra = "4500123456"
        self.validador.validar_oc_vs_distribuciones(orden_compra)

        # Check that read_sql was called twice
        self.assertEqual(mock_pandas.read_sql.call_count, 2)

        # Verify first call (query_oc)
        args_oc, kwargs_oc = mock_pandas.read_sql.call_args_list[0]
        query_oc = args_oc[0]
        params_oc = kwargs_oc.get('params')

        self.assertIn("?", query_oc)
        self.assertNotIn(f"'{orden_compra}'", query_oc)
        self.assertEqual(params_oc, [orden_compra])

        # Verify second call (query_distros)
        args_distros, kwargs_distros = mock_pandas.read_sql.call_args_list[1]
        query_distros = args_distros[0]
        params_distros = kwargs_distros.get('params')

        self.assertIn("?", query_distros)
        self.assertNotIn(f"'{orden_compra}'", query_distros)
        self.assertEqual(params_distros, [orden_compra])

if __name__ == "__main__":
    unittest.main()
