<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Services\FlagService;
use Illuminate\Database\Seeder;

class ChallengeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $flagService = new FlagService(); // We can instantiate it directly for seeding

        $challenges = [
            [
                'title' => 'Baby Web',
                'description' => "## Description\n\nA simple web challenge to get you started. Can you find the hidden flag?\n\n**Hint**: Check the source code carefully.\n\n## Connection\n\n`http://challenge.ctf.local:8080`",
                'category' => 'Web',
                'score' => 100,
                'flag_hash' => $flagService->hashFlag('CTF{baby_web_flag}'),
                'is_published' => true,
            ],
            [
                'title' => 'SQL Injection 101',
                'description' => "## Description\n\nCan you bypass the login page?\n\nThe admin left some vulnerabilities in the authentication system.\n\n## Connection\n\n`http://challenge.ctf.local:8081`\n\n## Note\n\nDon't forget to check for common SQL injection patterns.",
                'category' => 'Web',
                'score' => 200,
                'flag_hash' => $flagService->hashFlag('CTF{sql_injection_master}'),
                'is_published' => true,
            ],
            [
                'title' => 'XSS Adventure',
                'description' => "## Description\n\nFind a way to execute JavaScript on the vulnerable page and steal the admin cookie.\n\n## Connection\n\n`http://challenge.ctf.local:8082`",
                'category' => 'Web',
                'score' => 300,
                'flag_hash' => $flagService->hashFlag('CTF{xss_is_fun}'),
                'is_published' => true,
            ],
            [
                'title' => 'Caesar Cipher',
                'description' => "## Description\n\nA classic encryption method. Can you decode the message?\n\n```\nIODJVLEFEJ\n```\n\n**Flag format**: `CTF{decoded_message}`",
                'category' => 'Crypto',
                'score' => 100,
                'flag_hash' => $flagService->hashFlag('CTF{FLAGISABC}'), // Example flag matching IODJVLEFEJ roughly? Nah, just example.
                'is_published' => true,
            ],
            [
                'title' => 'RSA Basics',
                'description' => "## Description\n\nYou intercepted an RSA encrypted message. Can you decrypt it?\n\n```\nn = 3233\ne = 17\nc = 2790\n```\n\nFind the plaintext!",
                'category' => 'Crypto',
                'score' => 250,
                'flag_hash' => $flagService->hashFlag('CTF{rsa_easy_peasy}'),
                'is_published' => true,
            ],
            [
                'title' => 'Memory Dump',
                'description' => "## Description\n\nWe captured a memory dump from a suspicious process. Can you find the hidden credentials?\n\n## Files\n\n- [memory.dmp](/files/memory.dmp)\n\n**Hint**: Use volatility or similar tools.",
                'category' => 'Forensic',
                'score' => 300,
                'flag_hash' => $flagService->hashFlag('CTF{memory_leaks_are_bad}'),
                'is_published' => true,
            ],
            [
                'title' => 'Steganography',
                'description' => "## Description\n\nThere is a secret hidden in this image. Can you find it?\n\n## Files\n\n- [secret.png](/files/secret.png)",
                'category' => 'Forensic',
                'score' => 150,
                'flag_hash' => $flagService->hashFlag('CTF{hidden_in_pixels}'),
                'is_published' => true,
            ],
            [
                'title' => 'CrackMe 1',
                'description' => "## Description\n\nReverse engineer this binary to find the correct password.\n\n## Files\n\n- [crackme](/files/crackme)\n\n**Note**: Linux x64 ELF binary",
                'category' => 'Reverse',
                'score' => 200,
                'flag_hash' => $flagService->hashFlag('CTF{reverse_engineering_hero}'),
                'is_published' => true,
            ],
            [
                'title' => 'Obfuscated JS',
                'description' => "## Description\n\nThis JavaScript is heavily obfuscated. Can you figure out what the password is?\n\n```javascript\neval(atob(\"ZnVuY3Rpb24gY2hlY2soeCl7cmV0dXJuIHg9PT0nZmxhZyd9\"));\n```",
                'category' => 'Reverse',
                'score' => 150,
                'flag_hash' => $flagService->hashFlag('CTF{obfuscation_is_not_security}'),
                'is_published' => true,
            ],
            [
                'title' => 'Sanity Check',
                'description' => "## Description\n\nWelcome to the CTF! Here is your first flag:\n\n```\nCTF{welcome_to_the_competition}\n```\n\nJust submit it to make sure everything works!",
                'category' => 'Misc',
                'score' => 50,
                'flag_hash' => $flagService->hashFlag('CTF{welcome_to_the_competition}'),
                'is_published' => true,
            ],
            [
                'title' => 'Hidden in Plain Sight',
                'description' => "## Description\n\nThe flag is hidden somewhere on this page. Look carefully!\n\n<!-- FLAG{not_this_one} -->\n\n**Hint**: Sometimes things are hidden in unusual places.",
                'category' => 'Misc',
                'score' => 100,
                'flag_hash' => $flagService->hashFlag('CTF{html_comments_are_visible}'),
                'is_published' => true,
            ],
            [
                'title' => 'Advanced Web Exploitation',
                'description' => "## Description\n\nThis is an advanced challenge combining multiple web vulnerabilities.\n\n## Connection\n\n`http://challenge.ctf.local:8090`",
                'category' => 'Web',
                'score' => 500,
                'flag_hash' => $flagService->hashFlag('CTF{advanced_web_master}'),
                'is_published' => false, // Unpublished example
            ],
        ];

        foreach ($challenges as $challenge) {
            Challenge::create($challenge);
        }
    }
}
