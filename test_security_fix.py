import unittest
from unittest.mock import patch, MagicMock
import sys

# Mock pandas
mock_pandas = MagicMock()
sys.modules["pandas"] = mock_pandas
# Mock pyodbc
mock_pyodbc = MagicMock()
sys.modules["pyodbc"] = mock_pyodbc

# We need to import ValidadorPlanning after mocking dependencies
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
        mock_pandas.read_sql.reset_mock()
        mock_pandas.merge.reset_mock()

    def test_sql_parameterization(self):
        # Mock read_sql to return MagicMocks that behave like DataFrames
        mock_df = MagicMock()
        mock_df.__len__.return_value = 0
        mock_pandas.read_sql.return_value = mock_df

        # Mock merge to return a MagicMock
        mock_merged = MagicMock()
        mock_merged.__len__.return_value = 0
        # Mock for classification
        mock_merged.__getitem__.return_value = mock_merged
        mock_pandas.merge.return_value = mock_merged

        orden_compra = '4500123456'
        self.validador.validar_oc_vs_distribuciones(orden_compra)

        # Check that read_sql was called twice
        self.assertEqual(mock_pandas.read_sql.call_count, 2)

        # Check first call (query_oc)
        args1, kwargs1 = mock_pandas.read_sql.call_args_list[0]
        query1 = args1[0]
        params1 = kwargs1.get('params')

        self.assertIn('WHERE AHPON = ?', query1)
        self.assertNotIn(f"'{orden_compra}'", query1)
        self.assertEqual(params1, [orden_compra])

        # Check second call (query_distros)
        args2, kwargs2 = mock_pandas.read_sql.call_args_list[1]
        query2 = args2[0]
        params2 = kwargs2.get('params')

        self.assertIn('WHERE DSPON = ?', query2)
        self.assertNotIn(f"'{orden_compra}'", query2)
        self.assertEqual(params2, [orden_compra])

if __name__ == '__main__':
    unittest.main()
