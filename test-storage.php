<?php

echo "Storage Permission Test\n";
echo "======================\n\n";

$testDirs = [
    'storage/logs',
    'storage/app/public',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'bootstrap/cache',
    'public/storage'
];

$testFile = 'permission-test-' . time() . '.txt';
$testContent = 'Permission test at ' . date('Y-m-d H:i:s');

foreach ($testDirs as $dir) {
    echo "Testing: $dir\n";

    if (!is_dir($dir)) {
        echo "  ❌ Directory does not exist\n";
        continue;
    }

    if (!is_readable($dir)) {
        echo "  ❌ Not readable\n";
        continue;
    }

    if (!is_writable($dir)) {
        echo "  ❌ Not writable\n";
        continue;
    }

    // Test actual file write
    $testPath = $dir . '/' . $testFile;
    try {
        if (file_put_contents($testPath, $testContent) !== false) {
            echo "  ✅ Write test successful\n";
            unlink($testPath); // Clean up
        } else {
            echo "  ❌ Write test failed\n";
        }
    } catch (Exception $e) {
        echo "  ❌ Write test error: " . $e->getMessage() . "\n";
    }

    echo "\n";
}

echo "Test completed!\n";
echo "\nIf any tests failed, run these commands:\n";
echo "chmod -R 775 storage bootstrap/cache public/storage\n";
echo "chown -R www-data:www-data storage bootstrap/cache public/storage\n";
