package com.alphabirdztest;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alphabirdz.model.User;
import com.alphabirdz.repository.UserRepository;

@SpringBootTest (classes = com.alphabirdz.AlphabirdzApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
public class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;

    @Test
    public void shouldFindUserById() {
        //Long id = 0L;
        User user = this.userRepository.findById(0L);
        assertThat(user.getId() == 0L);
        assertThat(user.getUsername()).isEqualTo("jose");
    }
}