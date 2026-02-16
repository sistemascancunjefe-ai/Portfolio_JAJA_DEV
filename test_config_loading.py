import os
import unittest
from unittest.mock import patch, MagicMock
import sys

# Mock dependencies that are not installed
mock_pandas = MagicMock()
sys.modules["pandas"] = mock_pandas
mock_pyodbc = MagicMock()
sys.modules["pyodbc"] = mock_pyodbc

from ejemplo_validador_planning import get_db_config

class TestConfigLoading(unittest.TestCase):
    @patch.dict(os.environ, {
        'DB_HOST': 'test_host',
        'DB_PORT': '1234',
        'DB_DATABASE': 'test_db',
        'DB_USER': 'test_user',
        'DB_PASSWORD': 'test_password'
    })
    def test_config_from_env(self):
        config = get_db_config()
        self.assertEqual(config['host'], 'test_host')
        self.assertEqual(config['port'], '1234')
        self.assertEqual(config['database'], 'test_db')
        self.assertEqual(config['user'], 'test_user')
        self.assertEqual(config['password'], 'test_password')

    @patch.dict(os.environ, {}, clear=True)
    def test_config_defaults(self):
        config = get_db_config()
        self.assertEqual(config['host'], 'your_host_here')
        self.assertEqual(config['port'], '50000')
        self.assertEqual(config['database'], 'your_database_here')
        self.assertEqual(config['user'], 'your_user_here')
        self.assertEqual(config['password'], 'your_password_here')

if __name__ == '__main__':
    unittest.main()
