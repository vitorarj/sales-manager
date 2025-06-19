package com.salesmanagement.controller;

import com.salesmanagement.entity.Role;
import com.salesmanagement.entity.User;
import com.salesmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/create-admin")
    public User createAdmin() {
        User admin = new User("Admin Sistema", "admin@sistema.com", "123456", Role.ADMIN);
        return userRepository.save(admin);
    }

    @PostMapping("/create-client")
    public User createClient() {
        User client = new User("Cliente Teste", "cliente@teste.com", "123456", Role.CLIENTE);
        return userRepository.save(client);
    }

    @PostMapping("/create-seller")
    public User createSeller() {
        User seller = new User("Vendedor Teste", "vendedor@teste.com", "123456", Role.VENDEDOR);
        return userRepository.save(seller);
    }

    @GetMapping("/count")
    public String count() {
        return "Total de usuários: " + userRepository.count();
    }

    // ADICIONAR ESTE MÉTODO
    @GetMapping("/create-demo-users")
    public String createDemoUsers() {
        // Evitar duplicação
        if (userRepository.count() > 3) {
            return "⚠️ Usuários de demonstração já existem! Total: " + userRepository.count();
        }

        // Criar mais clientes
        userRepository.save(new User("Maria Silva", "maria@email.com", "123456", Role.CLIENTE));
        userRepository.save(new User("João Santos", "joao@email.com", "123456", Role.CLIENTE));
        userRepository.save(new User("Ana Costa", "ana@email.com", "123456", Role.CLIENTE));
        userRepository.save(new User("Pedro Lima", "pedro@email.com", "123456", Role.CLIENTE));
        userRepository.save(new User("Carla Oliveira", "carla@email.com", "123456", Role.CLIENTE));

        // Criar mais vendedores
        userRepository.save(new User("Carlos Vendas", "carlos@sistema.com", "123456", Role.VENDEDOR));
        userRepository.save(new User("Lucia Comercial", "lucia@sistema.com", "123456", Role.VENDEDOR));

        // Criar mais admins
        userRepository.save(new User("Roberto Gerente", "roberto@sistema.com", "123456", Role.ADMIN));

        long totalUsers = userRepository.count();
        return String.format("✅ Usuários de demonstração criados! Total: %d usuários", totalUsers);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        // Verificar se email já existe
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email já existe: " + user.getEmail());
        }

        return userRepository.save(user);
    }

    @PostMapping("/create-custom")
    public User createCustomUser(@RequestParam String name,
                                 @RequestParam String email,
                                 @RequestParam String password,
                                 @RequestParam Role role) {
        // Verificar se email já existe
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email já existe: " + email);
        }

        User user = new User(name, email, password, role);
        return userRepository.save(user);
    }

    @GetMapping("/create-custom-example")
    public String createCustomExample() {
        return "📝 Para criar usuário customizado: POST /api/users/create-custom?name=João&email=joao@teste.com&password=123456&role=CLIENTE";
    }
}