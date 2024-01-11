package com.alphabirdztest;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alphabirdz.model.Post;
import com.alphabirdz.repository.PostRepository;

@SpringBootTest (classes = com.alphabirdz.AlphabirdzApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
public class PostRepositoryTest {
    
    @Autowired
    private PostRepository postRepository;

    @Test
    public void shouldFindPostById() {
        Post post = this.postRepository.findById(0);
        assertThat(post.getId() == 0L);
        assertThat(post.getLocation()).isEqualTo("santo domingo de cachi");
    }
}